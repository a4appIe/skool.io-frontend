import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowLeft,
  Search,
  Eye,
  DollarSign,
  Users,
  RefreshCw,
  Download,
  Phone,
  Mail,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { getAllStudents } from "@/services/student.service";
import { getAllClasses } from "@/services/class.service";

export default function AdminFeesList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsData, classesData] = await Promise.all([
        getAllStudents(),
        getAllClasses(),
      ]);
      setStudents(studentsData || []);
      setClasses(classesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter students
  const filteredStudents = useMemo(() => {
    let filtered = students;

    // Filter by class
    if (classFilter !== "all") {
      filtered = filtered.filter(
        (student) =>
          student.studentClass?._id === classFilter ||
          student.studentClass === classFilter
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (student) =>
          student.name?.toLowerCase().includes(query) ||
          student.username?.toLowerCase().includes(query) ||
          student.admissionNumber?.toLowerCase().includes(query) ||
          student.phone?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [students, classFilter, searchQuery]);


  // Handle pay fees
  const handlePayFees = (student) => {
    // Navigate to payment page or open payment modal
    navigate(`/school/fees/payment/${student._id}`);
  };

  // Handle view details
  const handleViewDetails = (student) => {
    navigate(`/school/fees/details/${student._id}`);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
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
                  <h1 className="text-2xl font-bold text-gray-900">
                    Fees Management
                  </h1>
                  <p className="text-xs text-gray-500">
                    Manage student fees and payments
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant="outline"
                  onClick={fetchData}
                  className="border-red-200 hover:bg-red-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  className="bg-red-700 hover:bg-red-800 text-white"
                  onClick={() => toast.info("Export feature coming soon")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, username, or phone..."
                  className="pl-10 border-red-200 focus:border-red-400"
                />
              </div>
            </div>

            {/* Class Filter */}
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full md:w-48 border-red-200 focus:border-red-400">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    All Students ({students.length})
                  </div>
                </SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls._id} value={cls._id}>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      {cls.className}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Badge variant="secondary" className="px-3 py-2">
              {filteredStudents.length} student(s)
            </Badge>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                      Student
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                      Contact
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                      Fees Status
                    </th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700 text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Student Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center text-white font-semibold">
                            {student.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {student.name || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.username || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          {student.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              {student.phone}
                            </div>
                          )}
                          {student.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              {student.email}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Fees Status */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(student.totalFees || 50000)}
                          </div>
                          <Badge
                            variant="secondary"
                            className={
                              student.feesPaid
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {student.feesPaid ? "Paid" : "Pending"}
                          </Badge>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(student)}
                            className="border-gray-300 hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePayFees(student)}
                            className="bg-red-700 hover:bg-red-800 text-white"
                            disabled={student.feesPaid}
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Pay
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Students Found
              </h3>
              <p className="text-gray-600">
                {searchQuery || classFilter !== "all"
                  ? "No students match your search criteria."
                  : "No students available."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
