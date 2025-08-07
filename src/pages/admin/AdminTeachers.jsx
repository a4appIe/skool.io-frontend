import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, SortAsc, UserPlus, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TeacherCard from "@/components/admin/teachers/TeacherCard";
import useTeacherStore from "@/store/useTeacherStore";

const sortOptions = [
  { value: "name", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
  { value: "joining_date", label: "Joining Date" },
  { value: "username", label: "Username" },
];

export default function AdminTeachers() {
  const teachers = useTeacherStore((state) => state.getTeachers());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  // Filtering and sorting logic
  const filteredAndSortedTeachers = useMemo(() => {
    let filtered = teachers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.phone.includes(searchTerm)
      );
    }

    // Status filter - Updated to handle "all"
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((student) => student.status === statusFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "class":
          return a.studentClass.name.localeCompare(b.studentClass.name);
        case "admission_date":
          return new Date(b.admissionDate) - new Date(a.admissionDate);
        default:
          return 0;
      }
    });

    return filtered;
  }, [teachers, searchTerm, sortBy, statusFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("name");
  };

  // Updated active filters count to handle "all" values
  const activeFiltersCount = [
    searchTerm,
    statusFilter !== "all" ? statusFilter : "",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-red-700" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  All Teachers
                </h1>
                <p className="text-sm text-gray-500">
                  {filteredAndSortedTeachers.length} of {teachers.length}{" "}
                  teachers
                </p>
              </div>
            </div>
            <Button
              className="bg-red-700 hover:bg-red-800 text-white shadow-lg"
              onClick={() => navigate("/school/hr/recruit")}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add New Teacher
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, username, email or phone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-5 w-full max-w-9xl lg:w-auto">
              {/* Status Filter - FIXED */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[160px] border-gray-200 flex-1">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[160px] border-gray-200 flex-1">
                  <SortAsc className="h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        {filteredAndSortedTeachers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No teachers found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search criteria"
                : "No teachers have been added yet"}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTeachers.map((teacher) => (
              <TeacherCard teacher={teacher} key={teacher._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
