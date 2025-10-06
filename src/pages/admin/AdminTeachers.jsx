import { useState, useMemo } from "react";
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
import { Search, Filter, SortAsc, UserPlus, Users, X, ArrowLeft } from "lucide-react";
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

    // Status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((teacher) => teacher.status === statusFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "joining_date":
          return new Date(b.joiningDate) - new Date(a.joiningDate);
        case "username":
          return a.username.localeCompare(b.username);
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

  const activeFiltersCount = [
    searchTerm,
    statusFilter !== "all" ? statusFilter : "",
  ].filter(Boolean).length;

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
                  <h1 className="text-2xl font-bold text-gray-900">All Teachers</h1>
                  <p className="text-xs text-gray-500">
                    Manage and view all teachers
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1">
                  {filteredAndSortedTeachers.length} of {teachers.length} teachers
                </Badge>
                <Button
                  className="bg-red-700 hover:bg-red-800 text-white"
                  onClick={() => navigate("/school/hr/recruit")}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Teacher
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, username, email or phone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-red-600 focus:ring-red-600"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] border-gray-300">
                  <Filter className="h-4 w-4 mr-2" />
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
                <SelectTrigger className="w-full sm:w-[180px] border-gray-300">
                  <SortAsc className="h-4 w-4 mr-2" />
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
                  className="border-red-300 text-red-700 hover:bg-red-50"
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
