/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  User,
  BookOpen,
  FileText,
  Plus,
  Trash2,
  Save,
  UserPlus,
  Camera,
  X,
  Repeat2,
  File,
  Phone,
  MapPin,
  GraduationCap,
  ArrowLeft,
  DollarSign,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import createFormDataTeacher from "./fns/createFormDataTeacher";
import {
  getTeacher,
  registerTeacher,
  updateTeacher,
} from "@/services/teacher.service";
import createFormDataTeacherEdit from "./fns/createFormDataTeacherEdit";
import { getAllSalaries } from "@/services/salary.service";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const CATEGORIES = ["General", "OBC", "SC", "ST", "Other"];
const GENDERS = ["Male", "Female", "Other"];

// Initial form state - Added salary field
const initialFormState = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  qualification: "",
  experience: 0,
  password: "",
  username: "",
  joiningDate: new Date().toISOString().slice(0, 10),
  status: "Active",
  category: "General",
  aadharNumber: "",
  bloodGroup: "",
  salary: "", // NEW: salary field (will store amount)
  teacherImage: null,
  address: {
    street: "",
    city: "",
    state: "",
    pincode: "",
  },
  documents: [],
};

export function TeacherRecruitmentForm({ edit = false, teacherId = null }) {
  const [formData, setFormData] = useState(
    edit ? null : { ...initialFormState }
  );
  const [loading, setLoading] = useState(false);
  const [salaries, setSalaries] = useState([]); // NEW: salary options from backend
  const [loadingSalaries, setLoadingSalaries] = useState(false); // NEW: loading state
  const navigate = useNavigate();
  const TEACHER_PATH = import.meta.env.VITE_TEACHER_PATH;

  /**
   * NEW: Fetch salary data from backend
   * Replace this URL with your actual API endpoint
   */
  const fetchSalaries = async () => {
    setLoadingSalaries(true);
    try {
      // TODO: Replace with your actual API endpoint
      const salaries = await getAllSalaries();
      if (salaries) {
        setSalaries(salaries || []);
      }
    } catch (error) {
      console.error("Error fetching salaries:", error);
      setSalaries([]);
    } finally {
      setLoadingSalaries(false);
    }
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const fetchTeacherData = async () => {
    if (edit && teacherId) {
      setLoading(true);
      try {
        const teacherData = await getTeacher(teacherId);
        setFormData({ ...teacherData });
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateFormField = (field, value, section = null) => {
    setFormData((prev) => {
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const addDocument = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, { name: "", file: null }],
    }));
  };

  const updateDocument = (index, key, value) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.map((doc, i) =>
        i === index ? { ...doc, [key]: value } : doc
      ),
    }));
  };

  const removeDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (edit) {
        const fd = createFormDataTeacherEdit(formData);
        await updateTeacher(formData._id, fd);
      } else {
        const fd = createFormDataTeacher(formData);
        await registerTeacher(fd);
      }
      setFormData(initialFormState);
      navigate("/school/teachers");
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
  };

  // Fetch teacher data and salaries on mount
  useEffect(() => {
    fetchTeacherData();
    fetchSalaries(); // NEW: Fetch salary options
  }, []);

  if (!formData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

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
                    {edit ? "Edit Teacher" : "Teacher Recruitment Form"}
                  </h1>
                  <p className="text-xs text-gray-500">
                    Fill in all the required information
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <User className="h-6 w-6 text-red-700" />
              <h2 className="text-xl font-bold text-gray-900">
                Personal Information
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="name">
                  Teacher Name <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormField("name", e.target.value)}
                  placeholder="Enter teacher name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormField("password", e.target.value)}
                  placeholder="Enter password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender <span className="text-red-700">*</span>
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => updateFormField("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">
                  Date of Birth <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={
                    edit && formData.dob
                      ? new Date(formData.dob).toISOString().split("T")[0]
                      : formData.dob || ""
                  }
                  onChange={(e) => updateFormField("dob", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(value) =>
                    updateFormField("bloodGroup", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-700">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => updateFormField("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadharNumber">Aadhaar Number</Label>
                <Input
                  id="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={(e) =>
                    updateFormField(
                      "aadharNumber",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  placeholder="Enter Aadhaar number"
                  maxLength={12}
                />
              </div>
            </div>

            {/* Teacher Photo */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Label className="text-base font-semibold flex items-center gap-2 mb-4">
                <Camera className="h-5 w-5 text-red-700" />
                Teacher Photo <span className="text-red-700">*</span>
              </Label>
              <div className="flex items-start gap-4">
                <Input
                  id="teacherImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    updateFormField("teacherImage", e.target.files?.[0] || null)
                  }
                  className="hidden"
                />
                {!formData.teacherImage && (
                  <Label
                    htmlFor="teacherImage"
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Image
                  </Label>
                )}
                {formData.teacherImage && (
                  <div className="relative">
                    <img
                      src={
                        typeof formData.teacherImage === "string"
                          ? `${TEACHER_PATH}/${formData.teacherImage}`
                          : URL.createObjectURL(formData.teacherImage)
                      }
                      alt="Teacher"
                      className="w-32 h-40 object-cover border-2 border-gray-200 rounded-lg"
                    />
                    <Button
                      type="button"
                      onClick={() => updateFormField("teacherImage", null)}
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-600 hover:bg-red-700 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <Phone className="h-6 w-6 text-red-700" />
              <h2 className="text-xl font-bold text-gray-900">
                Contact Information
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormField("email", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    updateFormField("phone", e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter phone number"
                  maxLength={15}
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <MapPin className="h-6 w-6 text-red-700" />
              <h2 className="text-xl font-bold text-gray-900">
                Address Information
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) =>
                    updateFormField("street", e.target.value, "address")
                  }
                  placeholder="Enter street address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) =>
                    updateFormField("city", e.target.value, "address")
                  }
                  placeholder="Enter city"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">
                  State <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) =>
                    updateFormField("state", e.target.value, "address")
                  }
                  placeholder="Enter state"
                />
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="pincode">
                  Pincode <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="pincode"
                  value={formData.address.pincode}
                  onChange={(e) =>
                    updateFormField(
                      "pincode",
                      e.target.value.replace(/\D/g, ""),
                      "address"
                    )
                  }
                  placeholder="Enter pincode"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* Professional Information Section - ADDED SALARY FIELD */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <GraduationCap className="h-6 w-6 text-red-700" />
              <h2 className="text-xl font-bold text-gray-900">
                Professional Information
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="qualification">
                  Qualification <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) =>
                    updateFormField("qualification", e.target.value)
                  }
                  placeholder="Enter highest qualification (e.g., B.Ed, M.A)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">
                  Experience (Years) <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience}
                  onChange={(e) =>
                    updateFormField("experience", parseInt(e.target.value) || 0)
                  }
                  placeholder="Enter years of experience"
                />
              </div>

              {/* NEW: Salary Select Field */}
              <div className="space-y-2">
                <Label htmlFor="salary">
                  Salary Grade <span className="text-red-700">*</span>
                </Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 z-10 pointer-events-none" />
                  <Select
                    value={formData.salary?.toString() || ""}
                    onValueChange={(value) =>
                      updateFormField("salary", parseInt(value))
                    }
                    disabled={loadingSalaries}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue
                        placeholder={
                          loadingSalaries
                            ? "Loading salaries..."
                            : "Select salary grade"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {loadingSalaries ? (
                        <div className="p-4 text-sm text-gray-500 text-center">
                          Loading...
                        </div>
                      ) : salaries.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">
                          No salary grades available
                        </div>
                      ) : (
                        salaries.map((salary) => (
                          <SelectItem
                            key={salary._id}
                            value={salary.amount.toString()}
                          >
                            <div className="flex flex-col py-1">
                              <span className="font-semibold text-gray-900">
                                {salary.name}
                              </span>
                              <span className="text-xs text-gray-600">
                                {formatCurrency(salary.amount)} per month
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-red-700" />
                <h2 className="text-xl font-bold text-gray-900">
                  Required Documents
                </h2>
              </div>
              <Button
                type="button"
                onClick={addDocument}
                className="bg-red-700 hover:bg-red-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </div>

            {formData.documents.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">No documents uploaded yet</p>
                <Button
                  type="button"
                  onClick={addDocument}
                  className="bg-red-700 hover:bg-red-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Document
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {formData.documents.map((doc, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>
                          Document Name <span className="text-red-700">*</span>
                        </Label>
                        <Input
                          value={doc.name}
                          onChange={(e) =>
                            updateDocument(index, "name", e.target.value)
                          }
                          placeholder="e.g., Degree Certificate"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Upload File <span className="text-red-700">*</span>
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id={`docFile-${index}`}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) =>
                              updateDocument(index, "file", e.target.files?.[0])
                            }
                            className="hidden"
                          />
                          {!doc.file && (
                            <Label
                              htmlFor={`docFile-${index}`}
                              className="inline-flex items-center px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 cursor-pointer"
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Choose
                            </Label>
                          )}
                          {doc.file && (
                            <div className="flex items-center gap-2 flex-1">
                              <div className="bg-red-100 p-2 rounded border border-red-600 flex-1 overflow-hidden">
                                <span className="text-xs flex items-center gap-2">
                                  <File className="h-4 w-4" />
                                  {doc.file.name?.slice(0, 20) ||
                                    "File selected"}
                                </span>
                              </div>
                              <Label
                                htmlFor={`docFile-${index}`}
                                className="inline-flex items-center px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 cursor-pointer"
                              >
                                <Repeat2 className="h-4 w-4" />
                              </Label>
                            </div>
                          )}
                          <Button
                            type="button"
                            onClick={() => removeDocument(index)}
                            variant="outline"
                            size="icon"
                            className="text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                onClick={handleReset}
                variant="outline"
                className="border-gray-300"
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-red-700 hover:bg-red-800"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {edit ? "Updating..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {edit ? "Update Teacher" : "Submit Recruitment"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
