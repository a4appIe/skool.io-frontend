import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  DollarSign,
  Search,
  Filter,
  User,
  Eye,
  Download,
  RefreshCw,
  ArrowLeft,
  X,
  Phone,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import TeacherPayrollSheet from "@/components/admin/payroll/TeacherPayrollSheet";
import { getAllTeachers } from "@/services/teacher.service";
import { createPayroll } from "@/services/payroll.service";

// Main AdminPayroll Component
export default function AdminPayrollList() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sheet states - Separate state management
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("January");

  // Fetch payroll data - API function
  const fetchTeachersData = async () => {
    try {
      setLoading(true);
      const data = await getAllTeachers();
      console.log(data);
      setTeachers(data || []);
    } catch (error) {
      console.error("Error fetching payroll data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  useEffect(() => {
    fetchTeachersData();
  }, []);

  // Filter and search logic
  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      if (statusFilter !== "all" && teacher?.status !== statusFilter) {
        return false;
      }

      if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase();
        return (
          teacher.name.toLowerCase().includes(search) ||
          teacher.username.toLowerCase().includes(search) ||
          teacher.email.toLowerCase().includes(search) ||
          teacher.phone.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [teachers, statusFilter, searchTerm]);

  // Stats
  const statistics = useMemo(() => {
    return {
      total: teachers.length,
      paid: teachers.filter((p) => p.status === "paid").length,
      pending: teachers.filter((p) => p.status === "pending").length,
    };
  }, [teachers]);

  // Handle payment processing
  const handleProcessPayment = async () => {
    // Handle fields error
    if (!selectedTeacher || !selectedMonth) {
      return toast.error(`All fields are required`);
    }

    try {
      const data = {
        teacher: selectedTeacher._id,
        paidAmount: selectedTeacher.salary,
        month: selectedMonth,
      };
      console.log(data);

      if (!data) {
        return toast.error(`All fields are required`);
      }

      const response = await createPayroll(data);
      console.log(response);

      // Reset states after success
      if (response?.success) {
        setSelectedTeacher(null);
        setSelectedMonth("January");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
    }
  };

  // Handle opening payment sheet
  const handleOpenPaymentSheet = (payroll, e) => {
    e.stopPropagation(); // Prevent event bubbling
    setSelectedTeacher(payroll);
    setSelectedMonth(payroll.payrollMonth || "11");
  };

  const handleDetails = (payrollId) => {
    navigate(`/school/payroll/details/${payrollId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm rounded-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between py-8 flex-col md:flex-row gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => window.history.back()}
                  className="mr-2 bg-red-600 rounded-md hover:bg-red-700 text-white hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
                  <p className="text-xs text-gray-500">
                    Manage staff salaries and payments
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={fetchTeachersData}
                  className="border-gray-300 text-sm flex-1"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Refresh
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 text-sm flex-1">
                  <Download className="h-3 w-3 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, username, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 border-gray-300">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Teachers ({statistics.total})
                </SelectItem>
                <SelectItem value="paid">Paid ({statistics.paid})</SelectItem>
                <SelectItem value="pending">
                  Pending ({statistics.pending})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(statusFilter !== "all" || searchTerm) && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Filter className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Active Filters:
              {statusFilter !== "all" && ` Status: ${statusFilter}`}
              {searchTerm && ` Search: "${searchTerm}"`}
            </span>
            <Badge variant="secondary" className="ml-auto">
              {filteredTeachers.length} results
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setStatusFilter("all");
                setSearchTerm("");
              }}
              className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Payroll Table */}
        {filteredTeachers.length > 0 ? (
          <Card className="overflow-hidden p-0">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Teacher
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Contact
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Salary
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.map((teacher) => (
                    <TableRow
                      key={teacher._id}
                      className="hover:bg-gray-50 border-b border-gray-100"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            {teacher.profileImage ? (
                              <img
                                src={teacher.profileImage}
                                alt={teacher.teacherName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {teacher.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {teacher.username}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{teacher.phone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">
                              {teacher.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(teacher.salary)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDetails(teacher._id)}
                            className="border-gray-300"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>

                          {/* Pay Button */}
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={(e) => handleOpenPaymentSheet(teacher, e)}
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Pay
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all"
                ? "No Payroll Records Found"
                : "No Payroll Data Available"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Payroll data will appear here once teachers are added to the system."}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("all");
                  setSearchTerm("");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Teacher Payroll Sheet Component */}
        <TeacherPayrollSheet
          selectedTeacher={selectedTeacher}
          setSelectedTeacher={setSelectedTeacher}
          loading={loading}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          handleProcessPayment={handleProcessPayment}
        />
      </div>
    </div>
  );
}
