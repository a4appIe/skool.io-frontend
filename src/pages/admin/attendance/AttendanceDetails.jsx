import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Calendar,
  Phone,
  TrendingUp,
  TrendingDown,
  Download,
  UserCheck,
  UserX,
  CalendarDays,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { toast } from "sonner";
import { getStudent } from "@/services/student.service";
import { getAttendanceForStudent } from "@/services/attendance.service";

// Colors for pie chart
const COLORS = {
  present: "#22c55e", // green-500
  absent: "#ef4444", // red-500
};

export default function AttendanceDetails() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  // State management
  const [state, setState] = useState({
    isLoading: true,
    student: null,
    attendanceRecords: [],
    statusFilter: "all",
    monthFilter: "all",
  });

  // Fetch student and attendance data
  useEffect(() => {
    const fetchData = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        if (type === "student") {
          const studentData = await getStudent(id);
          const attendanceData = await getAttendanceForStudent(id);
          console.log(attendanceData);
          setState((prev) => ({
            ...prev,
            student: studentData,
            attendanceRecords: Array.isArray(attendanceData.data)
              ? attendanceData.data
              : [],
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load attendance data");
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, type]);

  const filteredRecords = useMemo(() => {
    let filtered = Array.isArray(state.attendanceRecords)
      ? [...state.attendanceRecords]
      : [];

    // Filter by status
    if (state.statusFilter !== "all") {
      filtered = filtered.filter(
        (record) => record.status === state.statusFilter
      );
    }

    // Filter by month
    if (state.monthFilter !== "all") {
      const targetMonth = parseInt(state.monthFilter);
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() + 1 === targetMonth;
      });
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [state?.attendanceRecords, state?.statusFilter, state?.monthFilter]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = state?.attendanceRecords?.length;
    const present = state?.attendanceRecords?.filter(
      (r) => r.status === "present"
    ).length;
    const absent = state?.attendanceRecords?.filter(
      (r) => r.status === "absent"
    ).length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    return {
      total,
      present,
      absent,
      percentage: parseFloat(percentage),
    };
  }, [state.attendanceRecords]);

  // Pie chart data
  const pieData = [
    { name: "Present", value: statistics.present, color: COLORS.present },
    { name: "Absent", value: statistics.absent, color: COLORS.absent },
  ];

  // Custom pie chart label
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Event handlers
  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleExport = () => {
    toast.info("Export functionality coming soon!");
  };

  const handlePhoneCall = (phoneNumber) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get months for filter
  const availableMonths = useMemo(() => {
    const months = new Set();
    state.attendanceRecords.forEach((record) => {
      const month = new Date(record.date).getMonth() + 1;
      months.add(month);
    });
    return Array.from(months).sort((a, b) => a - b);
  }, [state.attendanceRecords]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-16 w-16 animate-spin text-red-700 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">
            Loading Attendance Details
          </h2>
        </div>
      </div>
    );
  }

  if (!state.student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Student Not Found
            </h2>
            <Button onClick={handleBack} className="mt-4 bg-red-700 hover:bg-red-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Attendance
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  onClick={handleBack}
                  className="mr-2 bg-red-700 rounded-md hover:bg-red-800 text-white hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Attendance Details
                  </h1>
                  <p className="text-xs text-gray-500">
                    {state.student?.name} - {state.student?.studentClass?.className}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleExport}
                  className="bg-red-700 hover:bg-red-800 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-6 space-y-6">
              {/* Student Info Card */}
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center text-white text-2xl font-bold">
                      {state.student?.name?.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {state.student.name}
                      </CardTitle>
                      <p className="text-gray-600">
                        #{state.student?.username}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-gray-600">Admission No.</Label>
                      <p className="font-medium">
                        {state.student?.admissionNumber}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Roll No.</Label>
                      <p className="font-medium">{state.student?.rollNumber}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Class</Label>
                      <p className="font-medium">
                        {state.student.studentClass?.className}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Email</Label>
                      <p className="font-medium text-red-700 truncate">
                        {state.student?.email}
                      </p>
                    </div>
                  </div>

                  {/* Guardian Info */}
                  <div className="pt-4 border-t">
                    <Label className="text-gray-600 mb-2 block">
                      Guardian Contact
                    </Label>
                    <div className="space-y-2">
                      <p className="font-medium">
                        {state.student?.guardian?.name}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handlePhoneCall(state.student?.guardian?.phone)
                          }
                          className="flex-1 border-red-700 hover:bg-red-50"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          {state.student?.guardian?.phone}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart Card */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-red-700" />
                    Attendance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {statistics.total}
                      </p>
                      <p className="text-xs text-gray-600">Total Days</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {statistics.present}
                      </p>
                      <p className="text-xs text-gray-600">Present</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {statistics.absent}
                      </p>
                      <p className="text-xs text-gray-600">Absent</p>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomLabel}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [`${value} days`, name]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Attendance Percentage */}
                  <div className="mt-6 text-center">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold ${
                        statistics.percentage >= 90
                          ? "bg-green-100 text-green-800"
                          : statistics.percentage >= 80
                          ? "bg-yellow-100 text-yellow-800"
                          : statistics.percentage >= 75
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {statistics.percentage >= 75 ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                      {statistics.percentage}%
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Overall Attendance
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Content - Attendance Table */}
          <div className="lg:w-2/3">
            <Card className="shadow-lg border-0 px-2">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-red-700" />
                    Attendance Records
                  </CardTitle>
                  <div className="flex gap-2 text-sm">
                    <Badge variant="secondary">
                      {filteredRecords.length} records
                    </Badge>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Select
                    value={state.statusFilter}
                    onValueChange={(value) =>
                      updateState({ statusFilter: value })
                    }
                  >
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={state.monthFilter}
                    onValueChange={(value) =>
                      updateState({ monthFilter: value })
                    }
                  >
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      {availableMonths.map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {new Date(2024, month - 1).toLocaleDateString(
                            "en-US",
                            { month: "long" }
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Records Found
                    </h3>
                    <p className="text-gray-600">
                      {state.statusFilter !== "all" ||
                      state.monthFilter !== "all"
                        ? "No attendance records match your filters."
                        : "No attendance records available."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="font-semibold text-center">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map((record, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="py-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">
                                  {formatDate(record.date)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 text-center">
                              <Badge
                                className={`${
                                  record.status === "present"
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-red-100 text-red-800 border-red-200"
                                }`}
                              >
                                <div className="flex items-center gap-1">
                                  {record.status === "present" ? (
                                    <UserCheck className="h-3 w-3" />
                                  ) : (
                                    <UserX className="h-3 w-3" />
                                  )}
                                  {record.status.charAt(0).toUpperCase() +
                                    record.status.slice(1)}
                                </div>
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
