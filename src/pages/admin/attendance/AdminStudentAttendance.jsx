import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserCheck,
  Search,
  Users,
  Filter,
  RefreshCw,
  UserX,
  Loader2,
  BookOpen,
  CalendarDays,
  TrendingUp,
  Download,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/utils/constants";
import axios from "axios";
import { getAllClasses } from "@/services/class.service";
import { getAllStudents } from "@/services/student.service";
import AttendanceError from "@/components/admin/attendance/AttendanceError";
import AttendanceStudentsCard from "@/components/admin/attendance/AttendanceStudentsCard";

export default function AdminStudentAttendance() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  // State management
  const [state, setState] = useState({
    selectedClass: "all",
    searchQuery: "",
    isLoading: true,
    attendanceLoading: false,
  });

  const [attendanceData, setAttendanceData] = useState({});

  // Fetch Classes and Students Data
  useEffect(() => {
    async function fetchData() {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        let classes = await getAllClasses();
        if (classes) {
          setClasses(classes);
        }
        let students = await getAllStudents();
        if (students) {
          setStudents(students);
        }
      } catch (error) {
        setError(error.message || "Something went wrong. Please try again.");
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }
    fetchData();
  }, []);

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

  useEffect(() => {
    const fetchClassAttendance = async () => {
      if (state.selectedClass === "all") {
        await fetchAttendanceForStudents(students);
        return;
      }

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

    if (students.length > 0 && state.selectedClass) {
      fetchClassAttendance();
    }
  }, [state.selectedClass, students, fetchAttendanceForStudents]);

  const CLASSES_LIST = useMemo(
    () => [{ _id: "all", className: "All Classes" }, ...classes],
    [classes]
  );

  const filteredStudents = useMemo(() => {
    let filtered = students;

    if (state.selectedClass !== "all") {
      filtered = filtered.filter(
        (student) =>
          student.studentClass &&
          (student.studentClass._id === state.selectedClass ||
            student.studentClass === state.selectedClass)
      );
    }

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

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-red-700 mx-auto" />
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
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

  if (error) return <AttendanceError error={error} />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm rounded-xl">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between py-8 flex-col md:flex-row gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="mr-2 bg-red-700 rounded-md hover:bg-red-800 text-white hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Attendance Management
                  </h1>
                  <p className="text-xs text-gray-500">
                    {state.selectedClass === "all"
                      ? "Monitor attendance across all classes"
                      : `Track attendance for ${getClassName(
                          state.selectedClass
                        )}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  onClick={handleRefreshAttendance}
                  variant="outline"
                  className="border-red-200 hover:bg-red-50"
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
                  className="bg-red-700 hover:bg-red-800"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-sm border-l-4 border-l-red-700">
          <CardContent className="p-4">
            <div className="flex flex-col xl:flex-row xl:items-center gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <Filter className="h-5 w-5 text-red-700 flex-shrink-0" />
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
                    <SelectTrigger className="w-full transition-colors">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASSES_LIST.map((cls) => (
                        <SelectItem key={cls._id} value={cls._id}>
                          <div className="flex items-center gap-2">
                            {cls._id === "all" ? (
                              <Users className="h-4 w-4 text-red-700" />
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
                      className="pl-10 pr-10"
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
                  <Badge className="bg-red-100 text-red-800 border-red-200">
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

        {/* Class Info Card */}
        {state.selectedClass !== "all" && (
          <Card className="shadow-sm border-l-4 border-l-red-700 bg-gradient-to-r from-transparent to-red-50">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center text-white">
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

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-red-700">
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
              gradient: "from-red-700 to-red-800",
            },
            {
              title: "Excellent (≥90%)",
              value: statistics.excellentAttendance,
              icon: TrendingUp,
              gradient: "from-red-700 to-red-800",
            },
            {
              title: "Good (80-89%)",
              value: statistics.goodAttendance,
              icon: UserCheck,
              gradient: "from-red-700 to-red-800",
            },
            {
              title: "Poor (<75%)",
              value: statistics.poorAttendance,
              icon: UserX,
              gradient: "from-red-700 to-red-800",
            },
            {
              title: "Average",
              value: `${statistics.averageAttendance}%`,
              icon: CalendarDays,
              gradient: "from-red-700 to-red-800",
            },
          ].map((stat) => (
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

        {/* Students Display */}
        <AttendanceStudentsCard
          attendanceData={attendanceData}
          filteredStudents={filteredStudents}
          state={state}
          handleSearchClear={handleSearchClear}
          getClassName={getClassName}
        />
      </div>
    </div>
  );
}
