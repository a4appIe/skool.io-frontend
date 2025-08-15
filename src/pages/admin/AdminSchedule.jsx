import "../../components/admin/schedule/AdminSchedule.module.css";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import * as XLSX from "xlsx";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Users,
  Filter,
  BookOpen,
  Clock,
  Loader2,
  Hotel,
  PartyPopper,
  AlertCircle,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle,
  CalendarX,
} from "lucide-react";
import useClassStore from "@/store/useClassStore";
import useScheduleStore from "@/store/useScheduleStore";
import usePeriodsStore from "@/store/usePeriodStore";
import { toast } from "sonner";
import {
  createSchedule,
  deleteScheduleById,
  updateScheduleById,
} from "@/services/schedule.service";
import AddPeriods from "@/components/admin/schedule/AddPeriods";

// **Initialize moment localizer**
const localizer = momentLocalizer(moment);

// **Constants**
const SCHEDULE_TYPES = {
  // !-- DONE
  EVENT: "event",
  HOLIDAY: "holiday",
  CLASS: "class",
};

const CALENDAR_COLORS = {
  // !-- DONE
  [SCHEDULE_TYPES.CLASS]: "#3b82f6",
  [SCHEDULE_TYPES.EVENT]: "#dc2626",
  [SCHEDULE_TYPES.HOLIDAY]: "#f59e0b",
  DEFAULT: "#6b7280",
};

const DAY_MAPPING = {
  // !-- DONE
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
  // !-- DONE
  type: SCHEDULE_TYPES.EVENT,
  title: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
};

// **ENHANCED: Get priority events that should override class periods**
const getPriorityEventDetails = (date, priorityEvents) => {
  // !-- DONE
  const dateStr = moment(date).format("YYYY-MM-DD");
  return priorityEvents.filter((event) => {
    const eventDate = moment(event.start).format("YYYY-MM-DD");
    return eventDate === dateStr;
  });
};

// **ENHANCED: Process periods from Zustand store with holiday & event filtering + Excel time parsing**
const usePeriodsProcessor = () => {
  // !-- DONE
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
      const hours = parseInt(timeNumbers);
      const minutes = parseInt(timeNumbers || "0");
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        console.log(`🔧 DEBUG: Fallback time parsing:`, `${hours}:${minutes}`);
        return moment().hour(hours).minute(minutes);
      }
    }
    return null;
  }, []);

  // **MAIN FUNCTION: Process class periods with priority events filtering + enhanced time parsing**
  const processClassPeriodsFromStore = useCallback(
    // !-- DONE
    async (
      classId,
      periods,
      academicYear = moment().year(),
      priorityEvents = []
    ) => {
      if (!classId || classId === "all" || !periods || periods.length === 0) {
        setClassPeriodsEvents([]);
        setHiddenPeriodsCount(0);
        setHiddenPeriodsByType({ holidays: 0, events: 0 });
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

          const firstSheet = workbook.Sheets[workbook.SheetNames];
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

// **Responsive calendar hook**
const useResponsiveCalendar = () => {
  // !-- DONE
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

// **Form validation hook**
const useFormValidation = () => {
  // !-- DONE
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
  // **State management**
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

  // **Custom hooks**
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

  // **Store hooks**
  const { classes = [], getClasses } = useClassStore((state) => state);

  const { schedules: allSchedules = [], getSchedules } = useScheduleStore(
    (state) => state
  );

  const { periods = [], getPeriods } = usePeriodsStore((state) => state);

  // **Memoized data**
  const CLASSES_LIST = useMemo(
    // !-- DONE
    () => [{ _id: "all", className: "All Schedules" }, ...classes],
    [classes]
  );

  // **Filter schedules based on selected class**
  const filteredSchedules = useMemo(() => {
    // !-- DONE
    return allSchedules.filter((schedule) => {
      if (state.selectedClassFilter === "all") {
        return (
          schedule.type === SCHEDULE_TYPES.EVENT ||
          schedule.type === SCHEDULE_TYPES.HOLIDAY
        );
      }

      if (
        schedule.type === SCHEDULE_TYPES.EVENT ||
        schedule.type === SCHEDULE_TYPES.HOLIDAY
      ) {
        return true;
      }

      if (schedule.type === SCHEDULE_TYPES.CLASS && schedule.class) {
        return schedule.class._id === state.selectedClassFilter;
      }

      return false;
    });
  }, [allSchedules, state.selectedClassFilter]);

  // **ENHANCED: Get priority events (holidays and events) for filtering**
  const priorityEvents = useMemo(() => {
    // !-- DONE
    return filteredSchedules
      .filter(
        (schedule) =>
          schedule.type === SCHEDULE_TYPES.HOLIDAY ||
          schedule.type === SCHEDULE_TYPES.EVENT
      )
      .map((schedule) => ({
        id: schedule._id,
        title:
          schedule.title ||
          (schedule.type === SCHEDULE_TYPES.HOLIDAY ? "Holiday" : "Event"),
        start: new Date(schedule.startTime),
        end: new Date(schedule.endTime),
        type: schedule.type,
      }));
  }, [filteredSchedules]);

  // **ENHANCED: Merge with priority events - holidays and events override class periods**
  const calendarEvents = useMemo(() => {
    // !-- DONE
    const scheduleEvents = filteredSchedules.map((schedule) => {
      const startTime = new Date(schedule.startTime);
      const endTime = new Date(schedule.endTime);

      let title = "";
      if (schedule.type === SCHEDULE_TYPES.CLASS) {
        const subjectName = schedule.subject?.subjectName || "Unknown Subject";
        const teacherName = schedule.teacher?.name || "Unknown Teacher";
        title = `${subjectName} - ${teacherName}`;
      } else {
        title = schedule.title || "Event";
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

    // Merge with class periods from Excel files (already filtered to exclude priority event dates)
    const allEvents = [...scheduleEvents, ...classPeriodsEvents];

    return allEvents;
  }, [filteredSchedules, classPeriodsEvents]);

  // **ENHANCED: Statistics with priority event filtering info**
  const statistics = useMemo(() => {
    // !-- DONE
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

  // **Fetch data on mount**
  useEffect(() => {
    // !-- DONE
    const fetchData = async () => {
      setState((prev) => ({ ...prev, isDataLoading: true }));
      try {
        await Promise.all([getClasses(), getSchedules(), getPeriods()]);
      } catch (error) {
        toast.error(`Failed to fetch schedule data: ${error.message}`);
      } finally {
        setState((prev) => ({ ...prev, isDataLoading: false }));
      }
    };
    fetchData();
  }, [getClasses, getSchedules, getPeriods]);

  // **ENHANCED: Auto-process periods on class change with priority event filtering**
  useEffect(() => {
    // !-- DONE
    const handleClassChange = () => {
      if (state.selectedClassFilter !== "all" && periods.length > 0) {
        processClassPeriodsFromStore(
          state.selectedClassFilter,
          periods,
          state.academicYear,
          priorityEvents
        );
      }
    };

    handleClassChange();
  }, [
    state.selectedClassFilter,
    state.academicYear,
    periods,
    priorityEvents,
    processClassPeriodsFromStore,
  ]);

  // **Event handlers**
  const updateState = useCallback((updates) => {
    // !-- DONE
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleInputChange = useCallback(
    // !-- DONE
    (field, value) => {
      updateState({
        formData: { ...state.formData, [field]: value },
        formErrors: { ...state.formErrors, [field]: "" },
      });
    },
    [state.formData, state.formErrors, updateState]
  );

  const handleSelectSlot = useCallback(
    // !-- DONE
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
    // !-- DONE
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
    // !-- DONE
    updateState({
      isSheetOpen: false,
      selectedPeriod: null,
      isEditMode: false,
      formData: initialFormState,
      formErrors: {},
    });
  }, [updateState]);

  const handleSubmit = useCallback(
    // !-- DONE
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
        } else {
          await createSchedule(state.formData);
        }
        await getSchedules();
        handleCloseSheet();
      } catch (error) {
        console.error("Error creating schedule:", error);
        toast.error("Failed to create schedule. Please try again.");
      }
    },
    [
      state.formData,
      validateForm,
      updateState,
      getSchedules,
      handleCloseSheet,
      state.isEditMode,
      state.selectedPeriod,
    ]
  );

  const handleDeleteSchedule = useCallback(async () => {
    // !-- DONE
    if (!state.selectedPeriod) return;
    try {
      await deleteScheduleById(state.selectedPeriod);
      await getSchedules();
      handleCloseSheet();
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  }, [state.selectedPeriod, getSchedules, handleCloseSheet]);

  const handleClassFilterChange = useCallback(
    // !-- DONE
    (value) => {
      updateState({ selectedClassFilter: value });
    },
    [updateState]
  );

  const handlePeriodsRefresh = useCallback(
    // !-- DONE
    async (classId) => {
      if (classId && classId !== "all") {
        toast.info("Refreshing class periods...");
        await getPeriods();
        await processClassPeriodsFromStore(classId, periods, priorityEvents);
        toast.success("Class periods updated!");
      }
    },
    [getPeriods, processClassPeriodsFromStore, periods, priorityEvents]
  );

  // **Styling functions**
  const eventStyleGetter = useCallback(
    // !-- DONE
    (event) => {
      const eventType = event.resource?.type || SCHEDULE_TYPES.EVENT;
      console.log(event);
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
    // !-- DONE
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
    // !-- DONE
    (classId) => {
      const cls = CLASSES_LIST.find((c) => c._id === classId);
      return cls?.className || "Unknown Class";
    },
    [CLASSES_LIST]
  );

  // **Loading state**
  // !-- DONE
  const isLoading = state.isDataLoading || isProcessing;

  if (isLoading) {
    // !-- DONE
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-red-600 mx-auto" />
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Loading Schedule Data..
            </h2>
            <p className="text-gray-600 max-w-md">
              {isProcessing
                ? `Processing periods for ${getClassName(
                    state.selectedClassFilter
                  )}...`
                : "Please wait while we fetch classes, schedules, and periods..."}
            </p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (processingError) {
    // !-- DONE
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to Load Data
            </h2>
            <p className="text-gray-600 mb-4">
              {processingError || "There was an error loading the data."}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700"
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
    // !-- DONE
    {
      title: "Total Items",
      value: statistics.total,
      icon: Clock,
      gradient: "from-gray-500 to-gray-600",
    },
    {
      title: "Classes",
      value: statistics.classes,
      icon: BookOpen,
      gradient: "from-blue-500 to-blue-600",
      warning: hiddenPeriodsCount > 0 ? `${hiddenPeriodsCount} hidden` : null,
    },
    {
      title: "Events",
      value: statistics.events,
      icon: PartyPopper,
      gradient: "from-red-500 to-red-600",
    },
    {
      title: "Holidays",
      value: statistics.holidays,
      icon: Hotel,
      gradient: "from-orange-500 to-orange-600",
      subtitle:
        statistics.hiddenByHolidays > 0
          ? `Hidden ${statistics.hiddenByHolidays} classes`
          : null,
    },
  ];

  return (
    // !-- DONE
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <CalendarIcon className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
                  Schedule Management
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  {state.selectedClassFilter === "all"
                    ? "Manage school events and holidays"
                    : `Manage schedules for ${getClassName(
                        state.selectedClassFilter
                      )} - Academic Year ${state.academicYear}`}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => updateState({ isSheetOpen: true })}
                  className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200 hover:shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event/Holiday
                </Button>

                {state.selectedClassFilter !== "all" && (
                  <AddPeriods
                    classId={state.selectedClassFilter}
                    className={getClassName(state.selectedClassFilter)}
                    onUploadSuccess={() =>
                      handlePeriodsRefresh(state.selectedClassFilter)
                    }
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex flex-col xl:flex-row xl:items-center gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <Filter className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <Label className="font-semibold text-gray-700 whitespace-nowrap">
                  Filters:
                </Label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="flex-1 max-w-sm">
                  <Label className="text-sm text-gray-600 mb-1 block">
                    Class
                  </Label>
                  <Select
                    value={state.selectedClassFilter}
                    onValueChange={handleClassFilterChange}
                  >
                    <SelectTrigger className="w-full border-blue-200 focus:border-blue-400 transition-colors">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASSES_LIST.map((cls) => (
                        <SelectItem key={cls._id} value={cls._id}>
                          <div className="flex items-center gap-2">
                            {cls._id === "all" ? (
                              <Users className="h-4 w-4 text-blue-600" />
                            ) : (
                              <BookOpen className="h-4 w-4 text-gray-600" />
                            )}
                            {cls.className}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge variant="secondary" className="bg-gray-100">
                  {statistics.total} items showing
                </Badge>

                {state.selectedClassFilter !== "all" && (
                  <div className="flex gap-1">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      Class Mode Active
                    </Badge>
                    {hiddenPeriodsCount > 0 && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        <CalendarX className="h-3 w-3 mr-1" />
                        {hiddenPeriodsCount} Hidden
                      </Badge>
                    )}
                    {isProcessing && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Processing...
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Status */}
        {state.selectedClassFilter !== "all" && (
          <Card
            className={`shadow-sm border-l-4 ${
              classPeriodsEvents.length > 0
                ? "border-l-green-500 bg-green-50/50"
                : "border-l-orange-500 bg-orange-50/50"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {classPeriodsEvents.length > 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h4
                    className={`font-semibold ${
                      classPeriodsEvents.length > 0
                        ? "text-green-800"
                        : "text-orange-800"
                    }`}
                  >
                    {classPeriodsEvents.length > 0
                      ? `Class view: ${getClassName(state.selectedClassFilter)}`
                      : `No periods found: ${getClassName(
                          state.selectedClassFilter
                        )} `}
                  </h4>
                  <p
                    className={`text-sm mt-1 ${
                      classPeriodsEvents.length > 0
                        ? "text-green-700"
                        : "text-orange-700"
                    }`}
                  >
                    {classPeriodsEvents.length > 0
                      ? `Found ${classPeriodsEvents.length} recurring periods.`
                      : `You may have not uploaded the periods.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${stat.gradient} rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">
                      {stat.title}
                    </p>
                    <p className="text-xl lg:text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    {stat.subtitle && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FileSpreadsheet className="h-3 w-3" />
                        {stat.subtitle}
                      </p>
                    )}
                    {stat.warning && (
                      <p className="text-xs text-orange-600 flex items-center gap-1">
                        <CalendarX className="h-3 w-3" />
                        {stat.warning}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Legend */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h3 className="font-semibold text-gray-700">Legend:</h3>
              <div className="flex flex-wrap gap-2">
                {state.selectedClassFilter !== "all" && (
                  <>
                    <Badge className="bg-blue-600 text-white text-xs">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Class Periods
                    </Badge>
                  </>
                )}
                <Badge className="bg-red-600 text-white text-xs">
                  <PartyPopper className="h-3 w-3 mr-1" />
                  Events
                </Badge>
                <Badge className="bg-orange-500 text-white text-xs">
                  <Hotel className="h-3 w-3 mr-1" />
                  Holidays
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

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
        <Sheet open={state.isSheetOpen} onOpenChange={handleCloseSheet}>
          <SheetContent
            side="right"
            className="!w-full sm:!w-[600px] !max-w-none p-0 border-gray-200 overflow-y-auto [&>button]:hidden"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 lg:p-6">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-white text-lg lg:text-xl">
                  {state.isEditMode ? (
                    <>
                      <Edit3 className="h-5 w-5 lg:h-6 lg:w-6" />
                      Edit{" "}
                      {state.formData.type === SCHEDULE_TYPES.EVENT
                        ? "Event"
                        : "Holiday"}
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 lg:h-6 lg:w-6" />
                      Add New{" "}
                      {state.formData.type === SCHEDULE_TYPES.EVENT
                        ? "Event"
                        : "Holiday"}
                    </>
                  )}
                </SheetTitle>
                <SheetDescription className="text-red-100 text-sm">
                  {state.isEditMode
                    ? "Modify the details below. All fields marked with * are required."
                    : state.formData.type === SCHEDULE_TYPES.HOLIDAY ||
                      state.formData.type === SCHEDULE_TYPES.EVENT
                    ? "Create a priority event. This will hide all class periods on the selected date."
                    : "Fill in the required details to create a new event or holiday."}
                </SheetDescription>
              </SheetHeader>
            </div>

            <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">
                  Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={state.formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SCHEDULE_TYPES.EVENT}>
                      <div className="flex items-center gap-2">
                        <PartyPopper className="h-4 w-4 text-red-600" />
                        Event
                      </div>
                    </SelectItem>
                    <SelectItem value={SCHEDULE_TYPES.HOLIDAY}>
                      <div className="flex items-center gap-2">
                        <Hotel className="h-4 w-4 text-orange-600" />
                        Holiday
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {state.formErrors.type && (
                  <p className="text-sm text-red-500">
                    {state.formErrors.type}
                  </p>
                )}
                {(state.formData.type === SCHEDULE_TYPES.HOLIDAY ||
                  state.formData.type === SCHEDULE_TYPES.EVENT) && (
                  <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                    <CalendarX className="h-3 w-3 inline mr-1" />
                    Creating a {state.formData.type} will automatically hide all
                    class periods on this date.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={state.formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder={`Enter ${state.formData.type} title`}
                  className="w-full"
                />
                {state.formErrors.title && (
                  <p className="text-sm text-red-500">
                    {state.formErrors.title}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={state.formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder={`Enter ${state.formData.type} description`}
                  rows={3}
                  className="w-full resize-none"
                />
                {state.formErrors.description && (
                  <p className="text-sm text-red-500">
                    {state.formErrors.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={state.formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="w-full"
                />
                {state.formErrors.date && (
                  <p className="text-sm text-red-500">
                    {state.formErrors.date}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">
                    Start Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={state.formData.startTime}
                    onChange={(e) =>
                      handleInputChange("startTime", e.target.value)
                    }
                    className="w-full"
                  />
                  {state.formErrors.startTime && (
                    <p className="text-sm text-red-500">
                      {state.formErrors.startTime}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">
                    End Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={state.formData.endTime}
                    onChange={(e) =>
                      handleInputChange("endTime", e.target.value)
                    }
                  />
                  {state.formErrors.endTime && (
                    <p className="text-sm text-red-500">
                      {state.formErrors.endTime}
                    </p>
                  )}
                </div>
              </div>

              <SheetFooter className="flex flex-col justify-end sm:flex-row gap-2 pt-4 border-t">
                {state.isEditMode && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteSchedule}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}

                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto transition-all duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {state.isEditMode ? "Update" : "Create"}{" "}
                  {state.formData.type === SCHEDULE_TYPES.EVENT
                    ? "Event"
                    : "Holiday"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseSheet}
                  className="w-full sm:w-auto"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
