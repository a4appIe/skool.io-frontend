/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, Calendar, Download } from "lucide-react";
import { toast } from "sonner";
import TeacherPayrollOverviewCard from "@/components/admin/payroll/TeacherPayrollOverviewCard";
import TeacherDetailsCard from "@/components/admin/payroll/TeacherDetailsCard";
import { getTeacher } from "@/services/teacher.service";
import { getAllPayrolls } from "@/services/payroll.service";

// API functions
const getTeacherDetails = async (teacherId) => {
  try {
    let teacher = await getTeacher(teacherId);
    return teacher;
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return null;
  }
};

const getTeacherPayrolls = async (teacherId) => {
  try {
    let payrolls = await getAllPayrolls(teacherId);
    console.log(payrolls?.data);
    // Ensure we return an array
    return Array.isArray(payrolls?.data)
      ? payrolls?.data
      : payrolls?.data || [];
  } catch (error) {
    console.error("Error fetching payrolls:", error);
    return [];
  }
};

const downloadPayslip = async (payrollId) => {
  return toast.info("Feature coming soon");
};

// Main PayrollDetails Component
export default function AdminPayrollDetails() {
  const { teacherId } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [payrolls, setPayrolls] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(false);
  const [monthFilter, setMonthFilter] = useState("all");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [sessions, setSessions] = useState([]); // TODO: TO BE IMPLEMENTED

  // Fixed async function
  async function fetchData() {
    try {
      setLoading(true);

      // Wait for both promises to resolve
      const [teacherData, payrollsData] = await Promise.all([
        getTeacherDetails(teacherId),
        getTeacherPayrolls(teacherId),
      ]);

      console.log("Teacher data:", teacherData);
      console.log("Payrolls data:", payrollsData);

      setTeacher(teacherData);
      setPayrolls(payrollsData || []); // Ensure it's always an array
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (teacherId) {
      fetchData();
    }
  }, [teacherId]);

  // Filter payroll history - Fixed to handle empty/null payrolls
  const filteredPayrollHistory = useMemo(() => {
    if (!Array.isArray(payrolls) || payrolls.length === 0) {
      return [];
    }

    return payrolls.filter((record) => {
      console.log(record.session == sessionFilter)
      // Session filter
      if (sessionFilter !== "all" && record?.session !== sessionFilter) {
        return false;
      }
      // ✅ Session filter
      if (sessionFilter !== "all" && record?.session !== sessionFilter) {
        return false;
      }

      // Month filter
      if (monthFilter !== "all") {
        // Handle different possible month field names
        const recordMonth = record?.month;
        if (
          String(recordMonth).toLowerCase() !==
          String(monthFilter).toLowerCase()
        ) {
          return false;
        }
      }

      return true;
    });
  }, [monthFilter, payrolls, sessionFilter]);

  // Available months from data - Fixed
  const availableMonths = useMemo(() => {
    if (!Array.isArray(payrolls) || payrolls.length === 0) {
      return [];
    }

    // Extract unique months from the payrolls data
    const months = [
      ...new Set(
        payrolls
          .map((p) => String(p?.month).toLocaleLowerCase())
          .filter(Boolean)
      ),
    ];

    // List of all months
    const allMonths = [
      { label: "January" },
      { label: "February" },
      { label: "March" },
      { label: "April" },
      { label: "May" },
      { label: "June" },
      { label: "July" },
      { label: "August" },
      { label: "September" },
      { label: "October" },
      { label: "November" },
      { label: "December" },
    ];

    // Only keep those that exist in payrolls
    return allMonths.filter((month) =>
      months.includes(String(month.label).toLocaleLowerCase())
    );
  }, [payrolls]);

  const handleDownloadPayslip = async (payrollId) => {
    try {
      await downloadPayslip(payrollId);
    } catch (error) {
      console.error("Error downloading payslip:", error);
      toast.error("Failed to download payslip");
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "-";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg border-b border-gray-400 max-w-7xl m-auto rounded-2xl py-4">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/school/payroll")}
                className="bg-red-600 hover:bg-red-700 rounded text-white hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">
                Payroll Details
              </h1>
            </div>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                toast.info("Feature coming soon");
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Teacher Profile and Overview */}
          <div className="space-y-6">
            <TeacherDetailsCard teacher={teacher} />
            <TeacherPayrollOverviewCard payrolls={payrolls} />
          </div>

          {/* Right Content - Payroll Records */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-red-600" />
                    Payroll Records
                  </CardTitle>
                  <span className="text-sm text-gray-500">
                    {filteredPayrollHistory?.length || 0} records
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                  <Select
                    value={sessionFilter}
                    onValueChange={setSessionFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Session" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sessions</SelectItem>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={monthFilter} onValueChange={setMonthFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Months" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      {availableMonths.map((month) => (
                        <SelectItem key={month.label} value={month.label}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Records Table */}
                {filteredPayrollHistory?.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold text-gray-700">
                            Paid on
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Amount
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Session
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            For Month
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 text-center">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPayrollHistory.map((record) => (
                          <TableRow
                            key={record._id || record.id}
                            className="hover:bg-gray-50 border-b border-gray-100"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <div className="font-medium text-gray-900">
                                  {formatDate(
                                    record.paidDate ||
                                      record.createdAt ||
                                      `${
                                        record.payrollMonth ||
                                        record.month ||
                                        "2025-01"
                                      }-01`
                                  )}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">
                                  {formatCurrency(record?.paidAmount || 0)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {record?.session}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="font-medium text-gray-900">
                                {String(record?.month)[0].toUpperCase() +
                                  record?.month.slice(1, record?.month?.length)}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleDownloadPayslip(
                                      record._id || record.id
                                    )
                                  }
                                  className="h-8 px-3 border-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                                >
                                  <Download className="h-3 w-3" /> Slip
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {payrolls.length === 0
                      ? "No payroll records found for this teacher."
                      : "No payroll records found matching your filters."}
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
