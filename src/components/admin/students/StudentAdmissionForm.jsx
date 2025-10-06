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
import { Checkbox } from "@/components/ui/checkbox";
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
  MapPin,
  Users,
  School,
  ArrowLeft,
} from "lucide-react";
import {
  getStudent,
  registerStudent,
  updateStudent,
} from "@/services/student.service";
import { useNavigate } from "react-router-dom";
import createFormDataStudentEdit from "./fns/createFormDataStudentEdit";
import createFormDataStudent from "./fns/createFormDataStudent";
import { getAllClasses } from "@/services/class.service";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const CATEGORIES = ["General", "OBC", "SC", "ST", "Other"];
const GENDERS = ["Male", "Female", "Other"];
const RELATIONS = ["Father", "Mother", "Guardian"];

// Initial form state
const initialFormState = {
  name: "",
  gender: "",
  dob: "",
  bloodGroup: "",
  nationality: "Indian",
  religion: "",
  caste: "",
  category: "General",
  aadharNumber: "",
  email: "",
  phone: "",
  studentImage: null,
  password: "",
  studentClass: "",
  admissionNumber: "",
  admissionDate: new Date().toISOString().slice(0, 10),
  address: {
    street: "",
    city: "",
    state: "",
    pincode: "",
  },
  guardian: {
    name: "",
    relation: "",
    phone: "",
    email: "",
    occupation: "",
    address: "",
  },
  mother: {
    name: "",
    phone: "",
    occupation: "",
  },
  father: {
    name: "",
    phone: "",
    occupation: "",
  },
  hasPreviousSchool: false,
  previousSchool: {
    name: "",
    mediumOfInstruction: "",
    board: "",
    lastClassAttended: "",
    tcNumber: "",
    tcIssueDate: "",
    marksheetPath: null,
  },
  documents: [],
};

export function StudentAdmissionForm({ edit, studentId }) {
  const [formData, setFormData] = useState(
    edit ? null : { ...initialFormState }
  );
  const [loading, setLoading] = useState(false);
  const [classList, setClassList] = useState([]);
  const navigate = useNavigate();
  const STUDENT_PATH = import.meta.env.VITE_STUDENT_PATH;

  const fetchStudentData = async () => {
    try {
      const studentData = await getStudent(studentId);
      setFormData({
        ...studentData,
        studentClass: studentData.studentClass?._id,
      });
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const fetchClasses = async () => {
    let classes = await getAllClasses();
    setClassList(classes);
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
        const fd = createFormDataStudentEdit(formData);
        await updateStudent(formData._id, fd);
      } else {
        const fd = createFormDataStudent(formData);
        await registerStudent(fd);
      }
      setFormData(initialFormState);
      navigate("/school/students");
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
  };

  useEffect(() => {
    fetchClasses();
    if (edit && studentId) {
      fetchStudentData(studentId);
    }
  }, [edit, studentId]);

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
                    {edit ? "Edit Student" : "Student Admission Form"}
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
          {/* Class & Admission Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <BookOpen className="h-6 w-6 text-red-700" />
              <h2 className="text-xl font-bold text-gray-900">
                Class & Admission Details
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="class">
                  Class <span className="text-red-700">*</span>
                </Label>
                <Select
                  value={formData.studentClass?._id || formData.studentClass}
                  onValueChange={(value) =>
                    updateFormField("studentClass", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classList.map((cls) => (
                      <SelectItem key={cls._id} value={cls._id}>
                        {cls.className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admissionNumber">Admission Number</Label>
                <Input
                  disabled
                  id="admissionNumber"
                  value={formData.admissionNumber}
                  placeholder="Auto-generated"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input
                  disabled
                  id="admissionDate"
                  type="date"
                  value={
                    edit
                      ? new Date(formData.admissionDate)
                          .toISOString()
                          .split("T")[0]
                      : formData.admissionDate
                  }
                />
              </div>
            </div>
          </div>

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
                  Student Name <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormField("name", e.target.value)}
                  placeholder="Enter student name"
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
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) =>
                    updateFormField("nationality", e.target.value)
                  }
                  placeholder="Enter nationality"
                />
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
                <Label htmlFor="religion">Religion</Label>
                <Input
                  id="religion"
                  value={formData.religion}
                  onChange={(e) => updateFormField("religion", e.target.value)}
                  placeholder="Enter religion"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="caste">Caste</Label>
                <Input
                  id="caste"
                  value={formData.caste}
                  onChange={(e) => updateFormField("caste", e.target.value)}
                  placeholder="Enter caste"
                />
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

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormField("email", e.target.value)}
                  placeholder="Enter email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    updateFormField("phone", e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter phone"
                  maxLength={15}
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
            </div>

            {/* Student Photo */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Label className="text-base font-semibold flex items-center gap-2 mb-4">
                <Camera className="h-5 w-5 text-red-700" />
                Student Photo <span className="text-red-700">*</span>
              </Label>
              <div className="flex items-start gap-4">
                <Input
                  id="studentImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    updateFormField("studentImage", e.target.files?.[0] || null)
                  }
                  className="hidden"
                />
                {!formData.studentImage && (
                  <Label
                    htmlFor="studentImage"
                    className="inline-flex items-center px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 cursor-pointer"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Image
                  </Label>
                )}
                {formData.studentImage && (
                  <div className="relative">
                    <img
                      src={
                        typeof formData.studentImage === "string"
                          ? `${STUDENT_PATH}/${formData.studentImage}`
                          : URL.createObjectURL(formData.studentImage)
                      }
                      alt="Student"
                      className="w-32 h-40 object-cover border-2 border-gray-200 rounded-lg"
                    />
                    <Button
                      type="button"
                      onClick={() => updateFormField("studentImage", null)}
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-700 hover:bg-red-800 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
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

          {/* Family Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <Users className="h-6 w-6 text-red-700" />
              <h2 className="text-xl font-bold text-gray-900">
                Family Information
              </h2>
            </div>

            {/* Guardian */}
            <div className="bg-red-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4 text-red-800">
                Primary Guardian
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="guardianName">
                    Guardian Name <span className="text-red-700">*</span>
                  </Label>
                  <Input
                    id="guardianName"
                    value={formData.guardian.name}
                    onChange={(e) =>
                      updateFormField("name", e.target.value, "guardian")
                    }
                    placeholder="Enter guardian name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianRelation">
                    Relation <span className="text-red-700">*</span>
                  </Label>
                  <Select
                    value={formData.guardian.relation}
                    onValueChange={(value) =>
                      updateFormField("relation", value, "guardian")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Relation" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONS.map((relation) => (
                        <SelectItem key={relation} value={relation}>
                          {relation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianPhone">
                    Guardian Phone <span className="text-red-700">*</span>
                  </Label>
                  <Input
                    id="guardianPhone"
                    value={formData.guardian.phone}
                    onChange={(e) =>
                      updateFormField(
                        "phone",
                        e.target.value.replace(/\D/g, ""),
                        "guardian"
                      )
                    }
                    placeholder="Enter guardian phone"
                    maxLength={15}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianEmail">Guardian Email</Label>
                  <Input
                    id="guardianEmail"
                    type="email"
                    value={formData.guardian.email}
                    onChange={(e) =>
                      updateFormField("email", e.target.value, "guardian")
                    }
                    placeholder="Enter guardian email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianOccupation">Occupation</Label>
                  <Input
                    id="guardianOccupation"
                    value={formData.guardian.occupation}
                    onChange={(e) =>
                      updateFormField("occupation", e.target.value, "guardian")
                    }
                    placeholder="Enter occupation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianAddress">Address</Label>
                  <Input
                    id="guardianAddress"
                    value={formData.guardian.address}
                    onChange={(e) =>
                      updateFormField("address", e.target.value, "guardian")
                    }
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>

            {/* Parents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mother */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-blue-800">
                  Mother Information
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother Name</Label>
                    <Input
                      id="motherName"
                      value={formData.mother.name}
                      onChange={(e) =>
                        updateFormField("name", e.target.value, "mother")
                      }
                      placeholder="Enter mother name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motherPhone">Mother Phone</Label>
                    <Input
                      id="motherPhone"
                      value={formData.mother.phone}
                      onChange={(e) =>
                        updateFormField(
                          "phone",
                          e.target.value.replace(/\D/g, ""),
                          "mother"
                        )
                      }
                      placeholder="Enter mother phone"
                      maxLength={15}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motherOccupation">Occupation</Label>
                    <Input
                      id="motherOccupation"
                      value={formData.mother.occupation}
                      onChange={(e) =>
                        updateFormField("occupation", e.target.value, "mother")
                      }
                      placeholder="Enter occupation"
                    />
                  </div>
                </div>
              </div>

              {/* Father */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-green-800">
                  Father Information
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father Name</Label>
                    <Input
                      id="fatherName"
                      value={formData.father.name}
                      onChange={(e) =>
                        updateFormField("name", e.target.value, "father")
                      }
                      placeholder="Enter father name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fatherPhone">Father Phone</Label>
                    <Input
                      id="fatherPhone"
                      value={formData.father.phone}
                      onChange={(e) =>
                        updateFormField(
                          "phone",
                          e.target.value.replace(/\D/g, ""),
                          "father"
                        )
                      }
                      placeholder="Enter father phone"
                      maxLength={15}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fatherOccupation">Occupation</Label>
                    <Input
                      id="fatherOccupation"
                      value={formData.father.occupation}
                      onChange={(e) =>
                        updateFormField("occupation", e.target.value, "father")
                      }
                      placeholder="Enter occupation"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Previous School Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <School className="h-6 w-6 text-red-700" />
              <h2 className="text-xl font-bold text-gray-900">
                Previous School Details
              </h2>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-6">
              <Checkbox
                id="hasPreviousSchool"
                checked={formData.hasPreviousSchool}
                onCheckedChange={(checked) =>
                  updateFormField("hasPreviousSchool", checked)
                }
                className="data-[state=checked]:bg-red-700 data-[state=checked]:border-red-700"
              />
              <Label
                htmlFor="hasPreviousSchool"
                className="text-sm font-medium cursor-pointer"
              >
                Student has attended a previous school
              </Label>
            </div>

            {formData.hasPreviousSchool && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="previousSchoolName">
                    School Name <span className="text-red-700">*</span>
                  </Label>
                  <Input
                    id="previousSchoolName"
                    value={formData.previousSchool.name}
                    onChange={(e) =>
                      updateFormField("name", e.target.value, "previousSchool")
                    }
                    placeholder="Enter school name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mediumOfInstruction">Medium</Label>
                  <Input
                    id="mediumOfInstruction"
                    value={formData.previousSchool.mediumOfInstruction}
                    onChange={(e) =>
                      updateFormField(
                        "mediumOfInstruction",
                        e.target.value,
                        "previousSchool"
                      )
                    }
                    placeholder="Enter medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="board">
                    Board <span className="text-red-700">*</span>
                  </Label>
                  <Input
                    id="board"
                    value={formData.previousSchool.board}
                    onChange={(e) =>
                      updateFormField("board", e.target.value, "previousSchool")
                    }
                    placeholder="Enter board"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastClassAttended">Last Class</Label>
                  <Input
                    id="lastClassAttended"
                    value={formData.previousSchool.lastClassAttended}
                    onChange={(e) =>
                      updateFormField(
                        "lastClassAttended",
                        e.target.value,
                        "previousSchool"
                      )
                    }
                    placeholder="Enter last class"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tcNumber">TC Number</Label>
                  <Input
                    id="tcNumber"
                    value={formData.previousSchool.tcNumber}
                    onChange={(e) =>
                      updateFormField(
                        "tcNumber",
                        e.target.value,
                        "previousSchool"
                      )
                    }
                    placeholder="Enter TC number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tcIssueDate">TC Issue Date</Label>
                  <Input
                    id="tcIssueDate"
                    type="date"
                    value={formData.previousSchool.tcIssueDate}
                    onChange={(e) =>
                      updateFormField(
                        "tcIssueDate",
                        e.target.value,
                        "previousSchool"
                      )
                    }
                  />
                </div>

                <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                  <Label htmlFor="marksheet">Marksheet Upload</Label>
                  <Input
                    id="marksheet"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      updateFormField(
                        "marksheetPath",
                        e.target.files?.[0] || null,
                        "previousSchool"
                      )
                    }
                  />
                </div>
              </div>
            )}
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
                          placeholder="e.g., Birth Certificate"
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
                              <div className="bg-red-100 p-2 rounded border border-red-700 flex-1 overflow-hidden">
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
                    {edit ? "Update Student" : "Submit Admission"}
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
