import "../../components/admin/schedule/AdminSchedule.module.css";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import * as XLSX from "xlsx";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  Loader2,
  Hotel,
  PartyPopper,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  createSchedule,
  deleteScheduleById,
  getAllSchedules,
  updateScheduleById,
} from "@/services/schedule.service";
import FormSheet from "@/components/admin/schedule/FormSheet";
import Header from "@/components/admin/schedule/Header";
import ScheduleLegend from "@/components/admin/schedule/ScheduleLegend";
import ScheduleStats from "@/components/admin/schedule/ScheduleStats";
import ScheduleFileStatus from "@/components/admin/schedule/ScheduleFileStatus";
import ScheduleFilters from "@/components/admin/schedule/ScheduleFilters";
import { getAllClasses } from "@/services/class.service";
import { getAllPeriods } from "@/services/periods.service";

// Initialize moment localizer
const localizer = momentLocalizer(moment);

// Constants
const SCHEDULE_TYPES = {
  EVENT: "event",
  HOLIDAY: "holiday",
  CLASS: "class",
};

const CALENDAR_COLORS = {
  [SCHEDULE_TYPES.CLASS]: "#b91c1c",
  [SCHEDULE_TYPES.EVENT]: "#991b1b",
  [SCHEDULE_TYPES.HOLIDAY]: "#f59e0b",
  DEFAULT: "#6b7280",
};

const DAY_MAPPING = {
  Sunday: 0,
  sunday: 0,
  SUNDAY: 0,
  Sun: 0,
  SUN: 0,
  Monday: 1,
  monday: 1,
  MONDAY: 1,
  Mon: 1,
  MON: 1,
  Tuesday: 2,
  tuesday: 2,
  TUESDAY: 2,
  Tue: 2,
  TUE: 2,
  Wednesday: 3,
  wednesday: 3,
  WEDNESDAY: 3,
  Wed: 3,
  WED: 3,
  Thursday: 4,
  thursday: 4,
  THURSDAY: 4,
  Thu: 4,
  THU: 4,
  Friday: 5,
  friday: 5,
  FRIDAY: 5,
  Fri: 5,
  FRI: 5,
  Saturday: 6,
  saturday: 6,
  SATURDAY: 6,
  Sat: 6,
  SAT: 6,
};

const initialFormState = {
  type: SCHEDULE_TYPES.EVENT,
  title: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
};

// ENHANCED: Get priority events that should override class periods
const getPriorityEventDetails = (date, priorityEvents) => {
  const dateStr = moment(date).format("YYYY-MM-DD");
  return priorityEvents.filter((event) => {
    const eventDate = moment(event.start).format("YYYY-MM-DD");
    return eventDate === dateStr;
  });
};

// ENHANCED: Process periods from state with holiday & event filtering + Excel time parsing
const usePeriodsProcessor = () => {
  const [classPeriodsEvents, setClassPeriodsEvents] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState(null);
  const [hiddenPeriodsCount, setHiddenPeriodsCount] = useState(0);
  const [hiddenPeriodsByType, setHiddenPeriodsByType] = useState({
    holidays: 0,
    events: 0,
  });

  // **ENHANCED: Parse Excel decimal time fractions and regular time formats**
  const parseTimeValue = useCallback((timeValue) => {
    if (!timeValue && timeValue !== 0) return null;

    // Handle decimal fraction (Excel stores times as fractions of a day)
    if (
      !isNaN(timeValue) &&
      typeof timeValue === "number" &&
      timeValue >= 0 &&
      timeValue < 1
    ) {
      // Convert decimal fraction to hours and minutes
      const totalMinutes = Math.round(timeValue * 24 * 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return moment().hour(hours).minute(minutes);
      }
    }

    // Handle string time formats
    const timeStr = timeValue.toString().trim();
    const formats = [
      "HH:mm",
      "H:mm",
      "hh:mm A",
      "h:mm A",
      "HH:mm:ss",
      "H:mm:ss",
    ];

    for (const format of formats) {
      const parsed = moment(timeStr, format, true);
      if (parsed.isValid()) {
        console.log(
          `✅ DEBUG: String time parsed with format ${format}:`,
          parsed.format("HH:mm")
        );
        return parsed;
      }
    }

    // Fallback: extract numbers
    const timeNumbers = timeStr.match(/(\d{1,2}):?(\d{0,2})/);
    if (timeNumbers) {
      const hours = parseInt(timeNumbers[1]);
      const minutes = parseInt(timeNumbers[2] || "0");
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        console.log(`🔧 DEBUG: Fallback time parsing:`, `${hours}:${minutes}`);
        return moment().hour(hours).minute(minutes);
      }
    }
    return null;
  }, []);

  // **MAIN FUNCTION: Process class periods with priority events filtering + enhanced time parsing**
  const processClassPeriodsFromStore = useCallback(
    async (
      classId,
      periods,
      academicYear = moment().year(),
      priorityEvents = []
    ) => {
      // FIXED: Clear class periods when switching to "all" or no class selected
      if (!classId || classId === "all" || !periods || periods.length === 0) {
        setClassPeriodsEvents([]);
        setHiddenPeriodsCount(0);
        setHiddenPeriodsByType({ holidays: 0, events: 0 });
        setProcessingError(null);
        return [];
      }

      setIsProcessing(true);
      setProcessingError(null);

      try {
        // Find period that matches the class ID
        const matchingPeriod = periods.find(
          (period) =>
            period.class &&
            (period.class === classId ||
              period.class._id === classId ||
              (typeof period.class === "object" &&
                period.class._id === classId))
        );

        if (!matchingPeriod) {
          setClassPeriodsEvents([]);
          setHiddenPeriodsCount(0);
          setHiddenPeriodsByType({ holidays: 0, events: 0 });
          return [];
        }

        // Check if file exists in the period
        if (!matchingPeriod.file) {
          setClassPeriodsEvents([]);
          setHiddenPeriodsCount(0);
          setHiddenPeriodsByType({ holidays: 0, events: 0 });
          return [];
        }

        // Try to fetch file from uploads/periods folder
        try {
          const fileUrl = `/uploads/periods/${matchingPeriod.file}`;

          const response = await fetch(fileUrl);

          if (!response.ok) {
            throw new Error(`File not found at ${fileUrl}`);
          }

          const arrayBuffer = await response.arrayBuffer();

          // Parse Excel file
          const workbook = XLSX.read(arrayBuffer, { type: "array" });

          if (!workbook.SheetNames.length) {
            throw new Error("No sheets found in Excel file");
          }

          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rawData = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });

          // **ENHANCED: Process each period individually with enhanced time parsing**
          const validPeriods = [];
          const skippedPeriods = [];

          rawData.forEach((period, index) => {
            const day =
              period.Day || period.day || period.DAY || period.Weekday;
            const subject =
              period.Subject ||
              period.subject ||
              period.SUBJECT ||
              period.SubjectName;
            const teacher =
              period.Teacher ||
              period.teacher ||
              period.TEACHER ||
              period.TeacherName;
            const startTime =
              period.StartTime ||
              period.startTime ||
              period.START_TIME ||
              period["Start Time"];
            const endTime =
              period.EndTime ||
              period.endTime ||
              period.END_TIME ||
              period["End Time"];

            if (day && subject && teacher && startTime && endTime) {
              validPeriods.push(period);
            } else {
              skippedPeriods.push({
                index: index + 1,
                reason: "Missing required fields",
                period,
              });
            }
          });

          if (validPeriods.length === 0) {
            throw new Error("No valid periods found in Excel file");
          }

          // Generate recurring periods until December 31st
          const sessionStart = moment(`${academicYear}-01-01`);
          const sessionEnd = moment(`${academicYear}-12-31`);
          const recurringPeriods = [];

          // Process each period individually
          validPeriods.forEach((period, periodIndex) => {
            try {
              // Parse day
              const dayName = (
                period.Day ||
                period.day ||
                period.DAY ||
                period.Weekday ||
                ""
              )
                .toString()
                .trim();
              const dayOfWeek =
                DAY_MAPPING[dayName] ?? DAY_MAPPING[dayName.toLowerCase()];

              if (dayOfWeek === undefined) {
                return;
              }

              // **ENHANCED: Parse times with decimal fraction support**
              const startTimeValue =
                period.StartTime ||
                period.startTime ||
                period.START_TIME ||
                period["Start Time"] ||
                "09:00";
              const endTimeValue =
                period.EndTime ||
                period.endTime ||
                period.END_TIME ||
                period["End Time"] ||
                "10:00";

              let startTime = parseTimeValue(startTimeValue);
              let endTime = parseTimeValue(endTimeValue);

              if (!startTime || !endTime) {
                return;
              }

              // Ensure logical time order
              if (endTime.isSameOrBefore(startTime)) {
                endTime = startTime.clone().add(45, "minutes");
              }

              // Parse subject and teacher
              const subject = (
                period.Subject ||
                period.subject ||
                period.SUBJECT ||
                period.SubjectName ||
                "Unknown Subject"
              )
                .toString()
                .trim();
              const teacher = (
                period.Teacher ||
                period.teacher ||
                period.TEACHER ||
                period.TeacherName ||
                "Unknown Teacher"
              )
                .toString()
                .trim();

              // Find first occurrence of this specific day
              let currentDate = sessionStart.clone();
              while (
                currentDate.day() !== dayOfWeek &&
                currentDate.isSameOrBefore(sessionEnd)
              ) {
                currentDate.add(1, "day");
              }

              if (currentDate.isAfter(sessionEnd)) {
                return;
              }

              // Generate recurring periods for this specific period
              let weekIndex = 0;

              while (currentDate.isSameOrBefore(sessionEnd)) {
                const periodStart = currentDate
                  .clone()
                  .hour(startTime.hour())
                  .minute(startTime.minute())
                  .second(0)
                  .millisecond(0);

                const periodEnd = currentDate
                  .clone()
                  .hour(endTime.hour())
                  .minute(endTime.minute())
                  .second(0)
                  .millisecond(0);

                recurringPeriods.push({
                  id: `period-${periodIndex}-week-${weekIndex}-${dayOfWeek}-${startTime.format(
                    "HHmm"
                  )}`,
                  originalIndex: periodIndex,
                  weekNumber: weekIndex,
                  dayOfWeek,
                  dayName,
                  subject,
                  teacher,
                  startTime: periodStart.toDate(),
                  endTime: periodEnd.toDate(),
                  date: currentDate.format("YYYY-MM-DD"),
                  title: `${subject} - ${teacher}`,
                  description: `${dayName} class period - ${subject}`,
                  isRecurring: true,
                  isFromFile: true,
                  originalPeriod: period,
                  academicYear,
                  filePath: matchingPeriod.file,
                });

                // Move to next week
                currentDate.add(7, "days");
                weekIndex++;
              }
            } catch (error) {
              console.log(
                `⚠️ DEBUG: Skipping this period and continuing with others:  ${error}`
              );
            }
          });

          // **ENHANCED: Filter out periods that conflict with holidays and events**
          const filteredPeriods = [];
          let hiddenByHolidays = 0;
          let hiddenByEvents = 0;

          recurringPeriods.forEach((period) => {
            const conflictingEvents = getPriorityEventDetails(
              period.startTime,
              priorityEvents
            );

            if (conflictingEvents.length > 0) {
              // Log which events are causing the conflict
              conflictingEvents.forEach((conflictEvent) => {
                if (conflictEvent.type === SCHEDULE_TYPES.HOLIDAY) {
                  hiddenByHolidays++;
                } else if (conflictEvent.type === SCHEDULE_TYPES.EVENT) {
                  hiddenByEvents++;
                }
              });
            } else {
              // No conflicts, keep this period
              filteredPeriods.push(period);
            }
          });

          const totalHidden = hiddenByHolidays + hiddenByEvents;
          setHiddenPeriodsCount(totalHidden);
          setHiddenPeriodsByType({
            holidays: hiddenByHolidays,
            events: hiddenByEvents,
          });

          // Transform to calendar events
          const calendarEvents = filteredPeriods.map((period) => ({
            id: period.id,
            title: period.title,
            description: period.description,
            start: period.startTime,
            end: period.endTime,
            allDay: false,
            resource: {
              type: SCHEDULE_TYPES.CLASS,
              classId,
              subject: period.subject,
              teacher: period.teacher,
              dayOfWeek: period.dayOfWeek,
              dayName: period.dayName,
              originalPeriod: period.originalPeriod,
              isFromFile: true,
              isRecurring: true,
              weekNumber: period.weekNumber,
              academicYear: period.academicYear,
              filePath: period.filePath,
            },
          }));

          setClassPeriodsEvents(calendarEvents);

          return calendarEvents;
        } catch (error) {
          console.log("FILE ERROR: ", error);
          setClassPeriodsEvents([]);
          setHiddenPeriodsCount(0);
          setHiddenPeriodsByType({ holidays: 0, events: 0 });
          return [];
        }
      } catch (error) {
        const errorMessage = `Failed to process class periods: ${error.message}`;

        setProcessingError(errorMessage);
        setClassPeriodsEvents([]);
        setHiddenPeriodsCount(0);
        setHiddenPeriodsByType({ holidays: 0, events: 0 });

        toast.error(errorMessage, { duration: 5000 });

        return [];
      } finally {
        setIsProcessing(false);
      }
    },
    [parseTimeValue]
  );

  return {
    classPeriodsEvents,
    isProcessing,
    processingError,
    hiddenPeriodsCount,
    hiddenPeriodsByType,
    processClassPeriodsFromStore,
  };
};

// Responsive calendar hook
const useResponsiveCalendar = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    isMobile: typeof window !== "undefined" ? window.innerWidth < 768 : false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({ width, isMobile: width < 768 });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return {
    height: screenSize.isMobile ? 600 : 900,
    defaultView: screenSize.isMobile ? "day" : "week",
    isMobile: screenSize.isMobile,
  };
};

// Form validation hook
const useFormValidation = () => {
  const validateForm = useCallback((formData) => {
    const errors = {};
    const requiredFields = {
      type: "Type is required",
      title: "Title is required",
      description: "Description is required",
      date: "Date is required",
      startTime: "Start time is required",
      endTime: "End time is required",
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field]?.trim?.() && !formData[field]) {
        errors[field] = message;
      }
    });

    if (formData.startTime && formData.endTime) {
      const startTime = moment(formData.startTime, "HH:mm");
      const endTime = moment(formData.endTime, "HH:mm");
      if (endTime.isSameOrBefore(startTime)) {
        errors.endTime = "End time must be after start time";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, []);

  return { validateForm };
};

export default function AdminSchedule() {
  // CONVERTED: Replace Zustand with useState
  const [classes, setClasses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(false);

  // State management
  const [state, setState] = useState({
    isSheetOpen: false,
    selectedPeriod: null,
    isEditMode: false,
    selectedClassFilter: "all",
    formData: initialFormState,
    formErrors: {},
    isDataLoading: true,
    academicYear: moment().year(),
  });

  // Custom hooks
  const { height, defaultView, isMobile } = useResponsiveCalendar();
  const { validateForm } = useFormValidation();
  const {
    classPeriodsEvents,
    isProcessing,
    processingError,
    hiddenPeriodsCount,
    hiddenPeriodsByType,
    processClassPeriodsFromStore,
  } = usePeriodsProcessor();

  // CONVERTED: API functions to replace Zustand store actions
  const fetchClasses = useCallback(async () => {
    setIsLoadingClasses(true);
    try {
      const classes = await getAllClasses();
      setClasses(classes || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to fetch classes");
      setClasses([]);
    } finally {
      setIsLoadingClasses(false);
    }
  }, []);

  const fetchSchedules = useCallback(async () => {
    setIsLoadingSchedules(true);
    try {
      const schedules = await getAllSchedules();
      setSchedules(schedules || []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Failed to fetch schedules");
      setSchedules([]);
    } finally {
      setIsLoadingSchedules(false);
    }
  }, []);

  const fetchPeriods = useCallback(async () => {
    setIsLoadingPeriods(true);
    try {
      const periods = await getAllPeriods();
      setPeriods(periods || []);
    } catch (error) {
      console.error("Error fetching periods:", error);
      toast.error("Failed to fetch periods");
      setPeriods([]);
    } finally {
      setIsLoadingPeriods(false);
    }
  }, []);

  // Memoized data
  const CLASSES_LIST = useMemo(
    () => [{ _id: "all", className: "All Schedules" }, ...classes],
    [classes]
  );

  // FIXED: Simplified schedule filtering - ensure all schedules are included properly
  const allScheduleEvents = useMemo(() => {
    console.log("🔍 DEBUG: All schedules received:", schedules.length);
    
    return schedules.map((schedule, index) => {
      console.log(`🔍 DEBUG: Processing schedule ${index + 1}:`, {
        id: schedule._id,
        type: schedule.type,
        title: schedule.title,
        startTime: schedule.startTime,
        endTime: schedule.endTime
      });

      const startTime = new Date(schedule.startTime);
      const endTime = new Date(schedule.endTime);

      let title = "";
      if (schedule.type === SCHEDULE_TYPES.CLASS) {
        const subjectName = schedule.subject?.subjectName || "Unknown Subject";
        const teacherName = schedule.teacher?.name || "Unknown Teacher";
        title = `${subjectName} - ${teacherName}`;
      } else {
        title = schedule.title || (schedule.type === SCHEDULE_TYPES.HOLIDAY ? "Holiday" : "Event");
      }

      return {
        id: schedule._id,
        title,
        description: schedule.description || "",
        start: startTime,
        end: endTime,
        allDay: false,
        resource: {
          type: schedule.type,
          originalSchedule: schedule,
          classId: schedule.class?._id,
          subjectId: schedule.subject?._id,
          teacherId: schedule.teacher?._id,
          isFromFile: false,
        },
      };
    });
  }, [schedules]);

  // FIXED: Filter schedules based on class selection
  const filteredScheduleEvents = useMemo(() => {
    console.log("🔍 DEBUG: Filtering schedule events, selectedClassFilter:", state.selectedClassFilter);
    
    const filtered = allScheduleEvents.filter((event) => {
      // Always show events and holidays regardless of class filter
      if (
        event.resource.type === SCHEDULE_TYPES.EVENT ||
        event.resource.type === SCHEDULE_TYPES.HOLIDAY
      ) {
        console.log("✅ DEBUG: Including event/holiday:", event.title);
        return true;
      }

      // For class schedules
      if (event.resource.type === SCHEDULE_TYPES.CLASS) {
        if (state.selectedClassFilter === "all") {
          console.log("✅ DEBUG: Including class schedule (all selected):", event.title);
          return true;
        }
        
        const shouldInclude = event.resource.classId === state.selectedClassFilter;
        console.log(`${shouldInclude ? '✅' : '❌'} DEBUG: Class schedule filter result:`, {
          title: event.title,
          classId: event.resource.classId,
          selectedFilter: state.selectedClassFilter,
          included: shouldInclude
        });
        return shouldInclude;
      }

      return false;
    });

    console.log("🔍 DEBUG: Filtered schedule events count:", filtered.length);
    return filtered;
  }, [allScheduleEvents, state.selectedClassFilter]);

  // ENHANCED: Get priority events (holidays and events) for filtering periods
  const priorityEvents = useMemo(() => {
    const priority = allScheduleEvents
      .filter(
        (event) =>
          event.resource.type === SCHEDULE_TYPES.HOLIDAY ||
          event.resource.type === SCHEDULE_TYPES.EVENT
      )
      .map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        type: event.resource.type,
      }));

    console.log("🔍 DEBUG: Priority events for period filtering:", priority.length);
    return priority;
  }, [allScheduleEvents]);

  // ENHANCED: Final calendar events - merge filtered schedules with class periods
  const calendarEvents = useMemo(() => {
    console.log("🔍 DEBUG: Merging events:");
    console.log("  - Filtered schedule events:", filteredScheduleEvents.length);
    console.log("  - Class period events:", classPeriodsEvents.length);

    const allEvents = [...filteredScheduleEvents, ...classPeriodsEvents];
    
    console.log("🔍 DEBUG: Final merged events:", allEvents.length);
    
    // Debug: Log each event type
    const eventCounts = {
      events: allEvents.filter(e => e.resource?.type === SCHEDULE_TYPES.EVENT).length,
      holidays: allEvents.filter(e => e.resource?.type === SCHEDULE_TYPES.HOLIDAY).length,
      classes: allEvents.filter(e => e.resource?.type === SCHEDULE_TYPES.CLASS).length,
    };
    
    console.log("🔍 DEBUG: Event type counts:", eventCounts);

    return allEvents;
  }, [filteredScheduleEvents, classPeriodsEvents]);

  // ENHANCED: Statistics with priority event filtering info
  const statistics = useMemo(() => {
    const classEvents = calendarEvents.filter(
      (e) => e.resource?.type === SCHEDULE_TYPES.CLASS
    );
    return {
      total: calendarEvents.length,
      classes: classEvents.length,
      events: calendarEvents.filter(
        (e) => e.resource?.type === SCHEDULE_TYPES.EVENT
      ).length,
      holidays: calendarEvents.filter(
        (e) => e.resource?.type === SCHEDULE_TYPES.HOLIDAY
      ).length,
      fromFile: classEvents.filter((e) => e.resource?.isFromFile).length,
      hiddenDueToPriority: hiddenPeriodsCount,
      hiddenByHolidays: hiddenPeriodsByType.holidays,
      hiddenByEvents: hiddenPeriodsByType.events,
    };
  }, [calendarEvents, hiddenPeriodsCount, hiddenPeriodsByType]);

  // CONVERTED: Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setState((prev) => ({ ...prev, isDataLoading: true }));
      try {
        await Promise.all([fetchClasses(), fetchSchedules(), fetchPeriods()]);
      } catch (error) {
        toast.error(`Failed to fetch schedule data: ${error.message}`);
      } finally {
        setState((prev) => ({ ...prev, isDataLoading: false }));
      }
    };
    fetchData();
  }, [fetchClasses, fetchSchedules, fetchPeriods]);

  // ENHANCED: Auto-process periods on class change with priority event filtering
  useEffect(() => {
    const handleClassChange = () => {
      processClassPeriodsFromStore(
        state.selectedClassFilter,
        periods,
        state.academicYear,
        priorityEvents
      );
    };

    // Only process if periods are loaded
    if (periods.length > 0 || state.selectedClassFilter === "all") {
      handleClassChange();
    }
  }, [
    state.selectedClassFilter,
    state.academicYear,
    periods,
    priorityEvents,
    processClassPeriodsFromStore,
  ]);

  // Event handlers
  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleInputChange = useCallback(
    (field, value) => {
      updateState({
        formData: { ...state.formData, [field]: value },
        formErrors: { ...state.formErrors, [field]: "" },
      });
    },
    [state.formData, state.formErrors, updateState]
  );

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      updateState({
        selectedPeriod: null,
        isEditMode: false,
        formErrors: {},
        formData: {
          ...initialFormState,
          date: moment(start).format("YYYY-MM-DD"),
          startTime: moment(start).format("HH:mm"),
          endTime: moment(end).format("HH:mm"),
        },
        isSheetOpen: true,
      });
    },
    [updateState]
  );

  const handleSelectEvent = useCallback(
    (event) => {
      if (event.resource?.type === SCHEDULE_TYPES.CLASS) {
        if (event.resource?.isFromFile) {
          toast.info(
            `This period cannot be modified directly. Upload a new file to modify periods.`,
            { duration: 4000 }
          );
        } else {
          toast.info("Class schedules are managed through Excel file upload.", {
            duration: 4000,
          });
        }
        return;
      }

      const schedule = event.resource?.originalSchedule;
      if (schedule) {
        updateState({
          selectedPeriod: event,
          isEditMode: true,
          formErrors: {},
          formData: {
            type: schedule.type || SCHEDULE_TYPES.EVENT,
            title: schedule.title || "",
            description: schedule.description || "",
            date: moment(schedule.date || event.start).format("YYYY-MM-DD"),
            startTime: moment(event.start).format("HH:mm"),
            endTime: moment(event.end).format("HH:mm"),
          },
          isSheetOpen: true,
        });
      }
    },
    [updateState]
  );

  const handleCloseSheet = useCallback(() => {
    updateState({
      isSheetOpen: false,
      selectedPeriod: null,
      isEditMode: false,
      formData: initialFormState,
      formErrors: {},
    });
  }, [updateState]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validation = validateForm(state.formData);
      if (!validation.isValid) {
        updateState({ formErrors: validation.errors });
        toast.error("Please fix the errors in the form.");
        return;
      }

      try {
        if (state.isEditMode) {
          await updateScheduleById(state.selectedPeriod.id, state.formData);
          toast.success("Schedule updated successfully!");
        } else {
          await createSchedule(state.formData);
          toast.success("Schedule created successfully!");
        }
        await fetchSchedules();
        handleCloseSheet();
      } catch (error) {
        console.error("Error creating/updating schedule:", error);
        toast.error("Failed to save schedule. Please try again.");
      }
    },
    [
      state.formData,
      validateForm,
      updateState,
      fetchSchedules,
      handleCloseSheet,
      state.isEditMode,
      state.selectedPeriod,
    ]
  );

  const handleDeleteSchedule = useCallback(async () => {
    if (!state.selectedPeriod) return;
    try {
      await deleteScheduleById(state.selectedPeriod.id);
      await fetchSchedules();
      handleCloseSheet();
      toast.success("Schedule deleted successfully!");
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("Failed to delete schedule. Please try again.");
    }
  }, [state.selectedPeriod, fetchSchedules, handleCloseSheet]);

  const handleClassFilterChange = useCallback(
    (value) => {
      updateState({ selectedClassFilter: value });
    },
    [updateState]
  );

  const handlePeriodsRefresh = useCallback(
    async (classId) => {
      if (classId && classId !== "all") {
        toast.info("Refreshing class periods...");
        await fetchPeriods();
        await processClassPeriodsFromStore(classId, periods, state.academicYear, priorityEvents);
        toast.success("Class periods updated!");
      }
    },
    [fetchPeriods, processClassPeriodsFromStore, periods, priorityEvents, state.academicYear]
  );

  // Styling functions
  const eventStyleGetter = useCallback(
    (event) => {
      const eventType = event.resource?.type || SCHEDULE_TYPES.EVENT;
      const backgroundColor =
        event.title.split(" ")[0].toLowerCase() === "lunch"
          ? "tomato"
          : CALENDAR_COLORS[eventType] || CALENDAR_COLORS.DEFAULT;

      const isFromFile = event.resource?.isFromFile;

      return {
        style: {
          backgroundColor,
          borderRadius: "6px",
          opacity: isFromFile ? 0.9 : 1,
          color: "white",
          border: isFromFile ? `2px dashed ${backgroundColor}` : "none",
          fontSize: isMobile ? "10px" : "12px",
          padding: isMobile ? "2px" : "4px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.6)",
        },
      };
    },
    [isMobile]
  );

  const EventComponent = useCallback(({ event }) => {
    const eventType = event.resource?.type || SCHEDULE_TYPES.EVENT;

    const subtitleMap = {
      [SCHEDULE_TYPES.CLASS]: "Class Period",
      [SCHEDULE_TYPES.EVENT]: "Event",
      [SCHEDULE_TYPES.HOLIDAY]: "Holiday",
    };

    return (
      <div className="text-xs leading-tight">
        <div className="font-medium truncate flex items-center gap-1">
          {event.title}
        </div>
        <div className="opacity-90 truncate text-gray-200">
          {subtitleMap[eventType]}
        </div>
      </div>
    );
  }, []);

  const getClassName = useCallback(
    (classId) => {
      const cls = CLASSES_LIST.find((c) => c._id === classId);
      return cls?.className || "Unknown Class";
    },
    [CLASSES_LIST]
  );

  // CONVERTED: Loading state includes individual loading states
  const isLoading =
    state.isDataLoading ||
    isProcessing ||
    isLoadingClasses ||
    isLoadingSchedules ||
    isLoadingPeriods;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-red-700 mx-auto" />
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Loading Schedule Data...
            </h2>
            <p className="text-gray-600 max-w-md">
              {isProcessing
                ? `Processing periods for ${getClassName(
                    state.selectedClassFilter
                  )}...`
                : "Please wait while we fetch classes, schedules, and periods..."}
            </p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-red-700 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-red-700 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-red-700 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (processingError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to Load Data
            </h2>
            <p className="text-gray-600 mb-4">
              {processingError || "There was an error loading the data."}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-700 hover:bg-red-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Items",
      value: statistics.total,
      icon: Clock,
      gradient: "from-red-700 to-red-800",
    },
    {
      title: "Classes",
      value: statistics.classes,
      icon: BookOpen,
      gradient: "from-red-700 to-red-800",
      warning: hiddenPeriodsCount > 0 ? `${hiddenPeriodsCount} hidden` : null,
    },
    {
      title: "Events",
      value: statistics.events,
      icon: PartyPopper,
      gradient: "from-red-700 to-red-800",
    },
    {
      title: "Holidays",
      value: statistics.holidays,
      icon: Hotel,
      gradient: "from-red-700 to-red-800",
      subtitle:
        statistics.hiddenByHolidays > 0
          ? `Hidden ${statistics.hiddenByHolidays} classes`
          : null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Header
          state={state}
          getClassName={getClassName}
          updateState={updateState}
          handlePeriodsRefresh={handlePeriodsRefresh}
        />

        {/* Filters */}
        <ScheduleFilters
          state={state}
          handleClassFilterChange={handleClassFilterChange}
          CLASSES_LIST={CLASSES_LIST}
          isProcessing={isProcessing}
          statistics={statistics}
          hiddenPeriodsCount={hiddenPeriodsCount}
        />

        {/* File Status */}
        <ScheduleFileStatus
          state={state}
          classPeriodsEvents={classPeriodsEvents}
          getClassName={getClassName}
        />

        {/* Enhanced Statistics */}
        <ScheduleStats stats={stats} />

        {/* Enhanced Legend */}
        <ScheduleLegend state={state} />

        {/* Calendar */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-4 lg:p-6">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height }}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              defaultView={defaultView}
              views={["week", "day", "month", "agenda"]}
              step={30}
              timeslots={2}
              min={new Date(2024, 0, 1, 6, 0, 0)}
              max={new Date(2024, 0, 1, 22, 0, 0)}
              eventPropGetter={eventStyleGetter}
              components={{ event: EventComponent }}
              className="rounded-lg"
              messages={{
                allDay: "All Day",
                previous: "Back",
                next: "Next",
                today: "Today",
                month: "Month",
                week: "Week",
                day: "Day",
                agenda: "Agenda",
                date: "Date",
                time: "Time",
                event: "Event",
                noEventsInRange:
                  state.selectedClassFilter === "all"
                    ? "No events or holidays in this range."
                    : classPeriodsEvents.length > 0
                    ? "No schedules in this range for the selected filters."
                    : "No file found. Upload periods to see class periods.",
              }}
            />
          </CardContent>
        </Card>

        {/* Form Sheet */}
        <FormSheet
          handleSubmit={handleSubmit}
          state={state}
          handleInputChange={handleInputChange}
          handleDeleteSchedule={handleDeleteSchedule}
          handleCloseSheet={handleCloseSheet}
          SCHEDULE_TYPES={SCHEDULE_TYPES}
        />
      </div>
    </div>
  );
}
