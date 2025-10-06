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
  Users,
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
      toast.error("Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
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
          teacher.name?.toLowerCase().includes(search) ||
          teacher.username?.toLowerCase().includes(search) ||
          teacher.email?.toLowerCase().includes(search) ||
          teacher.phone?.toLowerCase().includes(search)
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
        fetchTeachersData();
        toast.success("Payment processed successfully!");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Failed to process payment");
    }
  };

  // Handle opening payment sheet
  const handleOpenPaymentSheet = (payroll, e) => {
    e.stopPropagation(); // Prevent event bubbling
    setSelectedTeacher(payroll);
    setSelectedMonth("January");
  };

  const handleDetails = (payrollId) => {
    navigate(`/school/payroll/details/${payrollId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
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
                  onClick={() => navigate(-1)}
                  className="mr-2 bg-red-700 rounded-md hover:bg-red-800 text-white hover:text-white"
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
              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant="outline"
                  onClick={fetchTeachersData}
                  className="border-gray-300 text-sm"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Refresh
                </Button>
                <Button
                  className="bg-red-700 hover:bg-red-800 text-sm"
                  onClick={() => toast.info("Feature coming soon!")}
                >
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
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <Filter className="h-4 w-4 text-red-700" />
            <span className="text-sm font-medium text-red-800">
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
              className="h-6 w-6 p-0 text-red-700 hover:text-red-800 hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Payroll Table */}
        {filteredTeachers.length > 0 ? (
          <Card className="overflow-hidden p-0 shadow-sm **:bg-gray-50">
            <CardContent className="p-0">
              <div className="overflow-x-auto !p-5">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead className="font-semibold text-gray-700">
                        Teacher
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Contact
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Salary
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 text-end">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow
                        key={teacher._id}
                        className="hover:bg-gray-50 border-b border-gray-100 transition-colors"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center text-white font-semibold flex-shrink-0">
                              {teacher.profileImage ? (
                                <img
                                  src={teacher.profileImage}
                                  alt={teacher.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                teacher.name?.charAt(0)?.toUpperCase() || "?"
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {teacher.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {teacher.username}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{teacher.phone || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate max-w-[150px]">
                                {teacher.email || "N/A"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(teacher.salary || 0)}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDetails(teacher._id)}
                              className="border-gray-300 hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>

                            {/* Pay Button */}
                            <Button
                              size="sm"
                              className="bg-red-700 hover:bg-red-800 text-white"
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
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all"
                ? "No Teachers Found"
                : "No Teachers Available"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Teachers will appear here once they are added to the system."}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("all");
                  setSearchTerm("");
                }}
                className="border-red-200 hover:bg-red-50"
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
