import { useState, useMemo, useEffect } from "react";
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
  Search,
  Filter,
  SortAsc,
  UserPlus,
  Users,
  X,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StudentCard from "@/components/admin/students/StudentCard";
import { getAllStudents } from "@/services/student.service";
import { getAllClasses } from "@/services/class.service";

const sortOptions = [
  { value: "name", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
  { value: "class", label: "Class" },
  { value: "admission_date", label: "Admission Date" },
];

export default function AdminStudents() {
  const [classList, setClassList] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStudents() {
      let studentList = await getAllStudents();
      setStudents(studentList);
    }
    async function fetchClasses() {
      let classes = await getAllClasses();
      setClassList(classes);
    }
    setLoading(true);
    fetchStudents();
    fetchClasses();
    setLoading(false);
  }, []);

  // Filtering and sorting logic
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.admissionNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.phone.includes(searchTerm)
      );
    }

    // Class filter
    if (selectedClass && selectedClass !== "all") {
      filtered = filtered.filter(
        (student) => student.studentClass._id === selectedClass
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "class":
          return a.studentClass.className.localeCompare(b.studentClass.className);
        case "admission_date":
          return new Date(b.admissionDate) - new Date(a.admissionDate);
        default:
          return 0;
      }
    });

    return filtered;
  }, [students, searchTerm, selectedClass, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedClass("all");
    setSortBy("name");
  };

  const activeFiltersCount = [
    searchTerm,
    selectedClass !== "all" ? selectedClass : "",
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm rounded-xl">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between py-8 flex-col sm:flex-row gap-4">
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
                    All Students
                  </h1>
                  <p className="text-xs text-gray-500">
                    Manage and view all students
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1">
                  {filteredAndSortedStudents.length} of {students.length}{" "}
                  students
                </Badge>
                <Button
                  className="bg-red-700 hover:bg-red-800 text-white"
                  onClick={() => navigate("/school/front-desk/admission")}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Student
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
                  placeholder="Search by name, admission no., email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-red-600 focus:ring-red-600"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {/* Class Filter */}
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full sm:w-[180px] border-gray-300">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classList.map((cls) => (
                    <SelectItem key={cls._id} value={cls._id}>
                      {cls.className}
                    </SelectItem>
                  ))}
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

        {/* Students Grid */}
        {filteredAndSortedStudents.length === 0 ? (
          <div className="text-center py-16">
            <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No students found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedClass !== "all"
                ? "Try adjusting your search criteria"
                : "No students have been added yet"}
            </p>
            {(searchTerm || selectedClass !== "all") && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedStudents.map((student) => (
              <StudentCard student={student} key={student._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
