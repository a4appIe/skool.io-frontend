/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  BookOpen,
  Eye,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getAllClasses } from "@/services/class.service";
import {
  createExamination,
  deleteExaminationById,
  getAllExaminations,
} from "@/services/examination.service";

// Mock data for classes
const mockClasses = [
  { id: "1", className: "Grade 1" },
  { id: "2", className: "Grade 2" },
  { id: "3", className: "Grade 3" },
  { id: "4", className: "Grade 4" },
  { id: "5", className: "Grade 5" },
  { id: "6", className: "Grade 6" },
];

// Mock data for exams
const mockExams = [
  {
    id: "1",
    name: "Mid Term Exam",
    startDate: "2025-10-15",
    endDate: "2025-10-25",
    classes: ["Grade 1", "Grade 2", "Grade 3"],
  },
  {
    id: "2",
    name: "Final Term Exam",
    startDate: "2025-12-01",
    endDate: "2025-12-15",
    classes: ["Grade 4", "Grade 5"],
  },
  {
    id: "3",
    name: "Unit Test 1",
    startDate: "2025-11-05",
    endDate: "2025-11-10",
    classes: ["Grade 1", "Grade 2"],
  },
];

const AdminExaminations = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState(mockExams);
  const [classList, setClassList] = useState(mockClasses);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  async function fetchClasses() {
    let classes = await getAllClasses();
    console.log(classes);
    setClassList(classes || []);
  }

  async function fetchExams() {
    let exams = await getAllExaminations();
    console.log(exams);
    setExams(exams || []);
  }

  useEffect(() => {
    setLoading(true);
    fetchClasses();
    fetchExams();
    setLoading(false);
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    selectedClasses: [],
  });

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle class selection
  const handleClassToggle = (classId) => {
    setFormData((prev) => ({
      ...prev,
      selectedClasses: prev.selectedClasses.includes(classId)
        ? prev.selectedClasses.filter((id) => id !== classId)
        : [...prev.selectedClasses, classId],
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      selectedClasses: [],
    });
    setIsEditing(false);
    setEditingId(null);
  };

  // Mock function to simulate adding exam
  const handleAddExam = async (data) => {
    let addedExam = await createExamination(data);
    if (addedExam) {
      fetchExams();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.startDate ||
      !formData.endDate ||
      formData.selectedClasses.length === 0
    ) {
      toast.error(
        "Please fill in all required fields and select at least one class"
      );
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setLoading(true);

    try {
      const classes = classList
        .filter((cls) => formData.selectedClasses.includes(cls._id))
        .map((cls) => cls._id);

      if (isEditing) {
        // Update existing exam

        toast.success("Exam updated successfully!");
      } else {
        // Add new exam
        const data = {
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          classes,
        };
        console.log(data);
        handleAddExam(data);
        toast.success("Exam added successfully!");
      }

      resetForm();
    } catch (error) {
      toast.error("Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    let isDel = deleteExaminationById(id);
    if (isDel) {
      fetchExams();
    }
  };

  // Handle view details
  const handleViewDetails = (examId) => {
    navigate(`/school/examinations/${examId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
                  onClick={() => navigate(-1)}
                  className="mr-2 bg-red-700 rounded-md hover:bg-red-800 text-white hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Examination Management
                  </h1>
                  <p className="text-xs text-gray-500">
                    Create and manage examinations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1">
                  {exams.length} Total Exams
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Edit className="h-5 w-5 text-red-700" />
                      Edit Examination
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 text-red-700" />
                      Add New Examination
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Examination Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Examination Name <span className="text-red-700">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter examination name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="border-gray-300"
                      required
                    />
                  </div>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Start Date <span className="text-red-700">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                      className="border-gray-300"
                      required
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      End Date <span className="text-red-700">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                      className="border-gray-300"
                      required
                    />
                  </div>

                  {/* Classes Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Select Classes <span className="text-red-700">*</span>
                    </Label>
                    <div className="border border-gray-300 rounded-lg p-4 space-y-3 max-h-35 overflow-y-auto bg-gray-50">
                      {classList.map((cls) => (
                        <div
                          key={cls._id}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={`class-${cls._id}`}
                            checked={formData.selectedClasses.includes(cls._id)}
                            onCheckedChange={() => handleClassToggle(cls._id)}
                            className="data-[state=checked]:bg-red-700 data-[state=checked]:border-red-700"
                          />
                          <Label
                            htmlFor={`class-${cls._id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {cls.className}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.selectedClasses.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {formData.selectedClasses.length} class(es) selected
                      </p>
                    )}
                  </div>
                  <div className="p-2 text-sm text-red-700 bg-red-50 rounded-lg border-red-700 border">
                    <b>Note:</b> You can not edit an exam once it has been
                    created. Please ensure all details are correct before
                    submitting.
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-red-700 hover:bg-red-800"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          {isEditing ? "Updating..." : "Adding..."}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {isEditing ? "Update" : "Add"} Exam
                        </>
                      )}
                    </Button>
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="border-gray-300"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Examinations Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-red-700" />
                  All Examinations
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">
                          Name
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Start Date
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          End Date
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Classes
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {console.log(exams)}
                      {exams.length > 0 ? (
                        exams.map((exam) => (
                          <TableRow
                            key={exam._id}
                            className="hover:bg-gray-50 border-b border-gray-100"
                          >
                            <TableCell className="font-medium text-gray-900">
                              {exam.name}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                {formatDate(exam.startDate)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                {formatDate(exam.endDate)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-800"
                                >
                                  {exam.classes?.length > 0 &&
                                  exam.classes?.length == 1
                                    ? `${exam.classes?.length} class`
                                    : `${exam.classes?.length} classes`}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewDetails(exam._id)}
                                  className="border-gray-300"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-300 text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Examination
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "
                                        {exam.name}"? This action cannot be
                                        undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(exam._id)}
                                        className="bg-red-700 hover:bg-red-800"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-gray-500"
                          >
                            No examinations found. Add your first examination
                            using the form.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminExaminations;
