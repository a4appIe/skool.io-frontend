/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  UserCheck,
  Search,
  Users,
  Filter,
  Phone,
  Eye,
  RefreshCw,
  UserX,
  AlertCircle,
  Loader2,
  BookOpen,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Download,
  User,
  School,
  Hash,
} from "lucide-react";
import useClassStore from "@/store/useClassStore";
import useStudentStore from "@/store/useStudentStore";
import { toast } from "sonner";
import { API_URL } from "@/utils/constants";
import axios from "axios";

// Helper function to get attendance color
const getAttendanceColor = (percentage) => {
  if (percentage >= 90) return "bg-green-500 text-white";
  if (percentage >= 80) return "bg-yellow-500 text-white";
  if (percentage >= 75) return "bg-orange-500 text-white";
  return "bg-red-500 text-white";
};

// Helper function to get attendance icon
const getAttendanceIcon = (percentage) => {
  if (percentage >= 90) return <TrendingUp className="h-3 w-3" />;
  if (percentage >= 75) return <TrendingDown className="h-3 w-3" />;
  return <UserX className="h-3 w-3" />;
};

export default function AdminStudentAttendance() {
  const navigate = useNavigate();

  // State management
  const [state, setState] = useState({
    selectedClass: "all",
    searchQuery: "",
    isLoading: true,
    attendanceLoading: false,
  });

  // **FIXED: Moved attendanceData to separate state**
  const [attendanceData, setAttendanceData] = useState({});

  // Store hooks
  const {
    classes = [],
    isLoading: classesLoading,
    getClasses,
    error: classesError,
  } = useClassStore();

  const {
    students = [],
    isLoading: studentsLoading,
    getStudents,
    error: studentsError,
  } = useStudentStore();

  const handleDetails = (studentId) => {
    navigate(`/school/attendance/student/details/${studentId}`);
  };

  // **FIXED: Moved functions inside component but wrapped with useCallback**
  const fetchStudentAttendance = useCallback(async (studentId) => {
    try {
      console.log(`📋 Fetching attendance for student: ${studentId}`);

      const response = await axios.get(`${API_URL}/attendance/${studentId}`);

      if (response.data.success) {
        const attendanceRecords = response.data.data;
        console.log(attendanceRecords);
        const totalClasses = attendanceRecords.length;
        const presentCount = attendanceRecords.filter(
          (record) => record.status === "present"
        ).length;
        const attendancePercentage =
          totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

        console.log(
          `✅ Student ${studentId}: ${presentCount}/${totalClasses} = ${attendancePercentage}%`
        );

        return {
          studentId,
          attendancePercentage,
          totalClasses,
          presentCount,
        };
      } else {
        console.warn(`⚠️ No successful response for student ${studentId}`);
        return {
          studentId,
          attendancePercentage: 0,
          totalClasses: 0,
          presentCount: 0,
        };
      }
    } catch (error) {
      console.error(
        `❌ Error fetching student attendance for ${studentId}:`,
        error
      );

      return {
        studentId,
        attendancePercentage: 0,
        totalClasses: 0,
        presentCount: 0,
      };
    }
  }, []);

  const fetchAttendanceForStudents = useCallback(
    async (studentList) => {
      if (!studentList || studentList.length === 0) {
        return {};
      }

      try {
        console.log(
          `🔍 Fetching attendance for ${studentList.length} students...`
        );

        setState((prev) => ({ ...prev, attendanceLoading: true }));

        const attendancePromises = studentList.map((student) =>
          fetchStudentAttendance(student._id)
        );

        const results = await Promise.all(attendancePromises);
        console.log(results);
        const updatedAttendanceData = {};

        results.forEach(
          ({ studentId, attendancePercentage, totalClasses, presentCount }) => {
            updatedAttendanceData[studentId] = {
              percentage: parseFloat(attendancePercentage),
              totalDays: totalClasses,
              presentDays: presentCount,
            };
          }
        );

        console.log(
          `✅ Successfully processed attendance for ${
            Object.keys(updatedAttendanceData).length
          } students`
        );

        setAttendanceData(updatedAttendanceData);
        setState((prev) => ({ ...prev, attendanceLoading: false }));

        toast.success(`Loaded attendance for ${studentList.length} students`, {
          duration: 3000,
        });

        return updatedAttendanceData;
      } catch (error) {
        console.error("❌ Error fetching attendances:", error);
        setState((prev) => ({ ...prev, attendanceLoading: false }));
        toast.error("Error fetching attendances.", {
          description:
            error.response?.data?.message ||
            "An error occurred while fetching attendances.",
        });
        throw error;
      }
    },
    [fetchStudentAttendance]
  );

  // **FIXED: Proper useEffect for fetching attendance when class changes**
  useEffect(() => {
    const fetchClassAttendance = async () => {
      if (state.selectedClass === "all") {
        await fetchAttendanceForStudents(students);
        // setAttendanceData({});
        return;
      }

      // Filter students by selected class
      const studentsInClass = students.filter(
        (student) =>
          student.studentClass &&
          (student.studentClass._id === state.selectedClass ||
            student.studentClass === state.selectedClass)
      );

      if (studentsInClass.length === 0) {
        setAttendanceData({});
        return;
      }

      console.log(`🔄 Fetching attendance for class: ${state.selectedClass}`);
      await fetchAttendanceForStudents(studentsInClass);
    };

    // Only fetch if we have students and a selected class
    if (students.length > 0 && state.selectedClass) {
      fetchClassAttendance();
    }
  }, [state.selectedClass, students, fetchAttendanceForStudents]);

  // Enhanced Desktop Table Row Component
  const TableRow = ({ student, onPhoneCall, getStudentClass }) => {
    const studentAttendance = attendanceData[student._id];
    const attendancePercentage = studentAttendance?.percentage || 0;

    return (
      <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
        {/* Student Info */}
        <td className="py-4 px-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
              {student.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-base">
                {student.name || "Unknown Name"}
              </div>
              <div className="text-sm text-gray-600 space-y-0.5">
                <div className="flex items-center">
                  <Hash className="h-3 w-3 mr-1" />
                  {student.username || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </td>

        {/* Gender */}
        <td className="py-4 px-6">
          <Badge
            variant="secondary"
            className={`${
              student.gender === "Male"
                ? "bg-blue-100 text-blue-800"
                : student.gender === "Female"
                ? "bg-pink-100 text-pink-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {student.gender || "N/A"}
          </Badge>
        </td>

        {/* Guardian Phone */}
        <td className="py-4 px-6">
          {student.guardian?.phone ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPhoneCall(student.guardian?.phone)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 h-auto"
            >
              <Phone className="h-4 w-4 mr-2" />
              <span className="text-sm">{student.guardian?.phone}</span>
            </Button>
          ) : (
            <span className="text-gray-400 text-sm">Not Available</span>
          )}
        </td>

        {/* Class */}
        <td className="py-4 px-6">
          <Badge variant="outline" className="font-medium">
            {getStudentClass(student)}
          </Badge>
        </td>

        {/* Attendance */}
        <td className="py-4 px-6">
          <div className="text-center space-y-2">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${getAttendanceColor(
                attendancePercentage
              )}`}
            >
              {state.attendanceLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                getAttendanceIcon(attendancePercentage)
              )}
              {state.attendanceLoading
                ? "Loading..."
                : `${Math.round(attendancePercentage)}%`}
            </div>
            <div className="text-xs text-gray-500">
              {state.attendanceLoading
                ? "Fetching..."
                : `${studentAttendance?.presentDays || 0}/${
                    studentAttendance?.totalDays || 0
                  } days`}
            </div>
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
              <div
                className={`h-full transition-all duration-300 ${
                  attendancePercentage >= 90
                    ? "bg-green-500"
                    : attendancePercentage >= 80
                    ? "bg-yellow-500"
                    : attendancePercentage >= 75
                    ? "bg-orange-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${attendancePercentage}%` }}
              ></div>
            </div>
          </div>
        </td>

        {/* Actions */}
        <td className="py-4 px-6">
          <Button
            onClick={() => handleDetails(student._id)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2"
          >
            <Eye className="h-4 w-4 mr-2" />
            Details
          </Button>
        </td>
      </tr>
    );
  };

  // Enhanced Student Card Component for Mobile View
  const StudentCard = ({
    student,
    onViewDetails,
    onPhoneCall,
    getStudentClass,
  }) => {
    const studentAttendance = attendanceData[student._id];
    const attendancePercentage = studentAttendance?.percentage || 0;

    return (
      <Card className="p-4 space-y-4 hover:shadow-md transition-shadow border border-gray-200">
        {/* Student Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
              {student.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {student.name || "Unknown Name"}
              </h3>
              <p className="text-sm text-gray-600">
                @{student.username || "N/A"}
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${getAttendanceColor(
              attendancePercentage
            )}`}
          >
            <div className="flex items-center gap-1">
              {state.attendanceLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                getAttendanceIcon(attendancePercentage)
              )}
              {state.attendanceLoading
                ? "..."
                : `${Math.round(attendancePercentage)}%`}
            </div>
          </div>
        </div>

        {/* Student Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              <span>Admission: {student.admissionNumber || "N/A"}</span>
            </div>
            {student.rollNumber && (
              <div className="flex items-center text-sm text-gray-600">
                <School className="h-4 w-4 mr-2 text-gray-400" />
                <span>Roll: {student.rollNumber}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Badge
              variant="secondary"
              className={`inline-flex ${
                student.gender === "Male"
                  ? "bg-blue-100 text-blue-800"
                  : student.gender === "Female"
                  ? "bg-pink-100 text-pink-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {student.gender || "N/A"}
            </Badge>
            <div>
              <Badge variant="outline" className="font-medium">
                {getStudentClass(student)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Attendance Details */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Attendance Record
              </p>
              <p className="text-xs text-gray-500">
                {state.attendanceLoading
                  ? "Loading attendance..."
                  : `${studentAttendance?.presentDays || 0} present out of ${
                      studentAttendance?.totalDays || 0
                    } days`}
              </p>
            </div>
            <div className="text-right">
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    attendancePercentage >= 90
                      ? "bg-green-500"
                      : attendancePercentage >= 80
                      ? "bg-yellow-500"
                      : attendancePercentage >= 75
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${attendancePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {student.guardian?.phone ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPhoneCall(student.guardian?.phone)}
              className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Guardian
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              No Phone
            </Button>
          )}
          <Button
            onClick={() => onViewDetails(student._id)}
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </Card>
    );
  };

  // Memoized classes list with "All Classes" option
  const CLASSES_LIST = useMemo(
    () => [{ _id: "all", className: "All Classes" }, ...classes],
    [classes]
  );

  // Filter students based on selected class and search query
  const filteredStudents = useMemo(() => {
    let filtered = students;

    // Filter by class
    if (state.selectedClass !== "all") {
      filtered = filtered.filter(
        (student) =>
          student.studentClass &&
          (student.studentClass._id === state.selectedClass ||
            student.studentClass === state.selectedClass)
      );
    }

    // Filter by search query
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (student) =>
          student.name?.toLowerCase().includes(query) ||
          student.username?.toLowerCase().includes(query) ||
          student.admissionNumber?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [students, state.selectedClass, state.searchQuery]);

  // **FIXED: Statistics calculation based on real attendance data**
  const statistics = useMemo(() => {
    const totalStudents = filteredStudents.length;
    const studentsWithAttendance = filteredStudents.filter(
      (student) => attendanceData[student._id]
    );

    const excellentAttendance = studentsWithAttendance.filter(
      (student) => attendanceData[student._id]?.percentage >= 90
    ).length;

    const goodAttendance = studentsWithAttendance.filter((student) => {
      const percentage = attendanceData[student._id]?.percentage || 0;
      return percentage >= 80 && percentage < 90;
    }).length;

    const poorAttendance = studentsWithAttendance.filter(
      (student) => (attendanceData[student._id]?.percentage || 0) < 75
    ).length;

    const averageAttendance =
      studentsWithAttendance.length > 0
        ? studentsWithAttendance.reduce(
            (sum, student) =>
              sum + (attendanceData[student._id]?.percentage || 0),
            0
          ) / studentsWithAttendance.length
        : 0;

    return {
      totalStudents,
      excellentAttendance,
      goodAttendance,
      poorAttendance,
      averageAttendance: Math.round(averageAttendance * 10) / 10,
    };
  }, [filteredStudents, attendanceData]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        await Promise.all([getClasses(), getStudents()]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(`Failed to fetch data: ${error.message}`);
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchData();
  }, [getClasses, getStudents]);

  // Event handlers
  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleClassChange = useCallback(
    (value) => {
      console.log(`🎯 Class filter changed to: ${value}`);
      updateState({ selectedClass: value });
    },
    [updateState]
  );

  const handleSearchChange = useCallback(
    (e) => {
      updateState({ searchQuery: e.target.value });
    },
    [updateState]
  );

  const handleSearchClear = useCallback(() => {
    updateState({ searchQuery: "" });
  }, [updateState]);

  const handleViewDetails = useCallback(
    (studentId) => {
      console.log(`📋 Viewing attendance details for student: ${studentId}`);
      navigate(`/admin/attendance/details/${studentId}`);
    },
    [navigate]
  );

  const handlePhoneCall = useCallback((phoneNumber) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      toast.error("Phone number not available");
    }
  }, []);

  const handleExportData = useCallback(() => {
    console.log("📊 Exporting attendance data...");
    toast.info("Export functionality coming soon!");
  }, []);

  const handleRefreshAttendance = useCallback(async () => {
    if (state.selectedClass === "all") {
      toast.warning("Please select a specific class to refresh attendance");
      return;
    }

    const studentsInClass = students.filter(
      (student) =>
        student.studentClass &&
        (student.studentClass._id === state.selectedClass ||
          student.studentClass === state.selectedClass)
    );

    if (studentsInClass.length === 0) {
      toast.warning("No students found in the selected class");
      return;
    }

    try {
      console.log("🔄 Refreshing attendance data...");
      toast.info("Refreshing attendance data...");

      setAttendanceData({});
      await fetchAttendanceForStudents(studentsInClass);

      toast.success("Attendance data refreshed successfully!");
    } catch (error) {
      console.error("❌ Failed to refresh attendance:", error);
      toast.error("Failed to refresh attendance data");
    }
  }, [state.selectedClass, students, fetchAttendanceForStudents]);

  const getClassName = useCallback(
    (classId) => {
      const cls = CLASSES_LIST.find((c) => c._id === classId);
      return cls?.className || "Unknown Class";
    },
    [CLASSES_LIST]
  );

  const getStudentClass = useCallback(
    (student) => {
      if (student.studentClass) {
        return typeof student.studentClass === "object"
          ? student.studentClass.className
          : getClassName(student.studentClass);
      }
      return "No Class";
    },
    [getClassName]
  );

  // Loading state
  const isLoading = state.isLoading || classesLoading || studentsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Loading Attendance Data
            </h2>
            <p className="text-gray-600 max-w-md">
              Please wait while we fetch classes and student information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (classesError || studentsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to Load Data
            </h2>
            <p className="text-gray-600 mb-4">
              {classesError ||
                studentsError ||
                "There was an error loading the attendance data."}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm p-0">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <UserCheck className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                  Attendance Management
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  {state.selectedClass === "all"
                    ? "Monitor attendance across all classes"
                    : `Track attendance for ${getClassName(
                        state.selectedClass
                      )}`}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleRefreshAttendance}
                  variant="outline"
                  className="border-blue-200 hover:bg-blue-50"
                  disabled={
                    state.attendanceLoading || state.selectedClass === "all"
                  }
                >
                  {state.attendanceLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
                <Button
                  onClick={handleExportData}
                  variant="outline"
                  className="border-blue-200 hover:bg-blue-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
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

              <div className="flex flex-col md:flex-row gap-3 flex-1">
                {/* Class Filter */}
                <div className="flex-1 max-w-sm">
                  <Label className="text-sm text-gray-600 mb-1 block">
                    Class
                  </Label>
                  <Select
                    value={state.selectedClass}
                    onValueChange={handleClassChange}
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

                {/* Search Input */}
                <div className="flex-1 max-w-md">
                  <Label className="text-sm text-gray-600 mb-1 block">
                    Search Student
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={state.searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search by name, username, admission number..."
                      className="pl-10 pr-10 border-blue-200 focus:border-blue-400"
                    />
                    {state.searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSearchClear}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge variant="secondary" className="bg-gray-100">
                  {filteredStudents.length} students
                </Badge>
                {state.selectedClass !== "all" && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {getClassName(state.selectedClass)}
                  </Badge>
                )}
                {state.attendanceLoading && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Loading...
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simplified Class Info Card - Only show when specific class is selected */}
        {state.selectedClass !== "all" && (
          <Card className="shadow-sm border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Class Information */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {getClassName(state.selectedClass)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Attendance overview for this class
                    </p>
                  </div>
                </div>

                {/* Class Stats */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-blue-600">
                      {filteredStudents.length}
                    </p>
                    <p className="text-xs text-gray-600">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-600">
                      {statistics.averageAttendance}%
                    </p>
                    <p className="text-xs text-gray-600">Avg Attendance</p>
                  </div>
                  {state.attendanceLoading && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Loading...
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          {[
            {
              title: "Total Students",
              value: statistics.totalStudents,
              icon: Users,
              gradient: "from-gray-500 to-gray-600",
            },
            {
              title: "Excellent (≥90%)",
              value: statistics.excellentAttendance,
              icon: TrendingUp,
              gradient: "from-green-500 to-green-600",
            },
            {
              title: "Good (80-89%)",
              value: statistics.goodAttendance,
              icon: UserCheck,
              gradient: "from-yellow-500 to-yellow-600",
            },
            {
              title: "Poor (<75%)",
              value: statistics.poorAttendance,
              icon: UserX,
              gradient: "from-red-500 to-red-600",
            },
            {
              title: "Average",
              value: `${statistics.averageAttendance}%`,
              icon: CalendarDays,
              gradient: "from-blue-500 to-blue-600",
            },
          ].map((stat, index) => (
            <Card
              key={stat.title}
              className="flex-1 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <CardContent className="p-4 lg:p-6 h-full">
                <div className="flex items-center gap-3 h-full">
                  <div
                    className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${stat.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <stat.icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">
                      {stat.title}
                    </p>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Responsive Students Display */}
        <Card className="shadow-lg border-0 p-0">
          <CardContent className="p-0">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Students Found
                </h3>
                <p className="text-gray-600">
                  {state.searchQuery.trim()
                    ? "No students match your search criteria."
                    : state.selectedClass === "all"
                    ? "Please select a class to view students and their attendance."
                    : `No students found in ${getClassName(
                        state.selectedClass
                      )}.`}
                </p>
                {state.searchQuery.trim() && (
                  <Button
                    variant="outline"
                    onClick={handleSearchClear}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop Table View (hidden on mobile) */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                        <tr>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            Student Information
                          </th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            Gender
                          </th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            Guardian Phone
                          </th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            Class
                          </th>
                          <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            Attendance
                          </th>
                          <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredStudents.map((student) => (
                          <TableRow
                            key={student._id}
                            student={student}
                            onViewDetails={handleViewDetails}
                            onPhoneCall={handlePhoneCall}
                            getStudentClass={getStudentClass}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card View (hidden on desktop) */}
                <div className="lg:hidden p-4 space-y-4">
                  {filteredStudents.map((student) => (
                    <StudentCard
                      key={student._id}
                      student={student}
                      onViewDetails={handleViewDetails}
                      onPhoneCall={handlePhoneCall}
                      getStudentClass={getStudentClass}
                    />
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
