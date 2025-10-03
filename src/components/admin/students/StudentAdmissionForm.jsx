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
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  BookOpen,
  FileText,
  Hash,
  Plus,
  Trash2,
  Save,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Upload,
  Camera,
  LucideTimerReset,
  X,
  Repeat2,
  File,
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

// Steps configuration
const steps = [
  {
    label: "Class",
    key: "classDetails",
    icon: BookOpen,
    description: "Select class and admission details",
  },
  {
    label: "Personal",
    key: "personal",
    icon: User,
    description: "Student's personal information",
  },
  {
    label: "Address",
    key: "address",
    icon: Hash,
    description: "Residential address details",
  },
  {
    label: "Family",
    key: "family",
    icon: User,
    description: "Guardian and family information",
  },
  {
    label: "School",
    key: "previous",
    icon: BookOpen,
    description: "Previous education details",
  },
  {
    label: "Docs",
    key: "docs",
    icon: FileText,
    description: "Upload required documents",
  },
];

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
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(
    edit ? null : { ...initialFormState }
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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

  // Validation functions
  function isStepValid(form, stepIndex) {
    if (!formData) return false; // Ensure form is loaded
    if (edit) return true;
    switch (stepIndex) {
      case 0: // Class Details
        return !edit ? !!(form.studentClass && form.admissionDate) : true;
      case 1: // Personal Info
        return !edit
          ? !!(
              form.name &&
              form.gender &&
              form.dob &&
              form.bloodGroup &&
              form.religion &&
              form.aadharNumber &&
              form.password &&
              form.category &&
              form.studentImage
            )
          : true;
      case 2: // Address
        return !edit
          ? !!(form.address.city && form.address.state && form.address.pincode)
          : true;
      case 3: // Family
        return !edit
          ? !!(
              form.guardian.name &&
              form.guardian.relation &&
              form.guardian.phone
            )
          : true;
      case 4: // Previous School
        if (!form.hasPreviousSchool) return true;
        return !edit
          ? !!(form.previousSchool.name && form.previousSchool.board)
          : true;
      case 5: // Documents
        return !edit
          ? form.documents.length > 0 &&
              form.documents.every((doc) => doc.name && doc.file)
          : true;
      default:
        return true;
    }
  }

  function getOverallProgress(form) {
    const totalSteps = steps.length;
    let completedSteps = 0;

    for (let i = 0; i < totalSteps; i++) {
      if (isStepValid(form, i)) {
        completedSteps++;
      }
    }

    return Math.round((completedSteps / totalSteps) * 100);
  }

  // Generic form field update function
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

    // Clear any existing errors for this field
    if (errors[field] || (section && errors[`${section}.${field}`])) {
      const errorKey = section ? `${section}.${field}` : field;
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Document management functions
  const addDocument = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, { name: "" }],
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

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < steps.length - 1 && isStepValid(formData, currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      if (edit) {
        const fd = createFormDataStudentEdit(formData);
        // Debugging output
        console.log("Final FormData:");
        for (let pair of fd.entries()) {
          console.log(pair[0], pair[1]);
        }
        await updateStudent(formData._id, fd);
      } else {
        const fd = createFormDataStudent(formData);
        // Debugging output
        console.log("Final FormData:");
        for (let pair of fd.entries()) {
          console.log(pair[0], pair[1]);
        }
        await registerStudent(fd);
      }
      // Clear saved data after successful submission
      setFormData(initialFormState);
      setCurrentStep(0);
      navigate("/school/students");
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setCurrentStep(0);
    setErrors({});
    localStorage.removeItem("studentAdmissionForm");
  };

  // Step content renderer
  const renderStepContent = () => {
    if (!formData) return null;
    switch (currentStep) {
      case 0: // Class Details
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="class">
                  Class <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={formData.studentClass?._id || formData.studentClass}
                  onValueChange={(value) => {
                    updateFormField("studentClass", value);
                  }}
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
                  onChange={(e) =>
                    updateFormField("admissionNumber", e.target.value)
                  }
                  placeholder="Automatically generated"
                  maxLength={30}
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
                  onChange={(e) =>
                    updateFormField("admissionDate", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );

      case 1: // Personal Info
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="name">
                  Student Name <span className="text-red-600">*</span>
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
                  Gender <span className="text-red-600">*</span>
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
                  Date of Birth <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={
                    edit && formData.dob && !isNaN(new Date(formData.dob))
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
                  Category <span className="text-red-600">*</span>
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
                  placeholder="Enter email address"
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
                  placeholder="Enter phone number"
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-600">*</span>
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

            {/* Student Photo Section */}
            <div className="border-t pt-6">
              <div className="space-y-4">
                <Label
                  className="text-lg font-semibold flex items-center gap-2"
                  htmlFor={"studentImage"}
                >
                  <Camera className="h-5 w-5 text-red-700" />
                  Student Photo <span className="text-red-600">*</span>
                </Label>

                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      id="studentImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        console.log(e.target.files);
                        return updateFormField(
                          "studentImage",
                          e.target.files?.[0] || null
                        );
                      }}
                      className="hidden border-dashed border-2 border-gray-300 hover:border-red-400 transition-colors"
                    />
                    <div className="flex items-center gap-2">
                      {!formData.studentImage && (
                        <Label
                          htmlFor="studentImage"
                          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 cursor-pointer transition"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Choose Image
                        </Label>
                      )}
                      {formData.studentImage && (
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              src={
                                typeof formData.studentImage === "string"
                                  ? `${STUDENT_PATH}/${formData.studentImage}`
                                  : URL.createObjectURL(formData.studentImage)
                              }
                              alt="Student preview"
                              className="w-32 h-40 object-cover border-2 border-gray-200 rounded-lg shadow-sm"
                            />
                            <Button
                              type="button"
                              onClick={() =>
                                updateFormField("studentImage", null)
                              }
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-600 hover:bg-red-700 text-white rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Upload a clear passport-size photo (JPG, PNG, max 5MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Address
        return (
          <div className="space-y-6">
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
                  City <span className="text-red-600">*</span>
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
                  State <span className="text-red-600">*</span>
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
                  Pincode <span className="text-red-600">*</span>
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
        );

      case 3: // Family Details
        return (
          <div className="space-y-8">
            {/* Guardian Information */}
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-800">
                <User className="h-5 w-5" />
                Primary Guardian Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="guardianName">
                    Guardian Name <span className="text-red-600">*</span>
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
                    Relation <span className="text-red-600">*</span>
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
                    Guardian Phone <span className="text-red-600">*</span>
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
                  <Label htmlFor="guardianOccupation">
                    Guardian Occupation
                  </Label>
                  <Input
                    id="guardianOccupation"
                    value={formData.guardian.occupation}
                    onChange={(e) =>
                      updateFormField("occupation", e.target.value, "guardian")
                    }
                    placeholder="Enter guardian occupation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianAddress">Guardian Address</Label>
                  <Input
                    id="guardianAddress"
                    value={formData.guardian.address}
                    onChange={(e) =>
                      updateFormField("address", e.target.value, "guardian")
                    }
                    placeholder="Enter guardian address"
                  />
                </div>
              </div>
            </div>

            {/* Parents Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mother Information */}
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
                    <Label htmlFor="motherOccupation">Mother Occupation</Label>
                    <Input
                      id="motherOccupation"
                      value={formData.mother.occupation}
                      onChange={(e) =>
                        updateFormField("occupation", e.target.value, "mother")
                      }
                      placeholder="Enter mother occupation"
                    />
                  </div>
                </div>
              </div>

              {/* Father Information */}
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
                    <Label htmlFor="fatherOccupation">Father Occupation</Label>
                    <Input
                      id="fatherOccupation"
                      value={formData.father.occupation}
                      onChange={(e) =>
                        updateFormField("occupation", e.target.value, "father")
                      }
                      placeholder="Enter father occupation"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Previous School
        return (
          <div className="space-y-6">
            {/* Checkbox for previous school */}
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
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
                className="text-sm font-medium text-yellow-800 cursor-pointer"
              >
                Student has attended a previous school
              </Label>
            </div>

            {formData.hasPreviousSchool && (
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-red-700" />
                  Previous School Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="previousSchoolName">
                      School Name <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="previousSchoolName"
                      value={formData.previousSchool.name}
                      onChange={(e) =>
                        updateFormField(
                          "name",
                          e.target.value,
                          "previousSchool"
                        )
                      }
                      placeholder="Enter previous school name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mediumOfInstruction">
                      Medium of Instruction
                    </Label>
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
                      placeholder="Enter medium of instruction"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="board">
                      Board <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="board"
                      value={formData.previousSchool.board}
                      onChange={(e) =>
                        updateFormField(
                          "board",
                          e.target.value,
                          "previousSchool"
                        )
                      }
                      placeholder="Enter board"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastClassAttended">
                      Last Class Attended
                    </Label>
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
                      placeholder="Enter last class attended"
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
                </div>

                <div className="mt-6 space-y-2">
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
                    className="border-dashed border-2 border-gray-300 hover:border-red-400 transition-colors"
                  />
                  {formData.previousSchool.marksheetPath &&
                    typeof formData.previousSchool.marksheetPath !==
                      "string" && (
                      <div className="text-sm text-gray-600 mt-2 p-2 bg-white rounded border">
                        <span className="font-medium">Selected:</span>{" "}
                        {formData.previousSchool.marksheetPath.name}
                      </div>
                    )}
                </div>
              </div>
            )}

            {!formData.hasPreviousSchool && (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-lg">
                  No previous school information required
                </p>
                <p className="text-sm">
                  Check the box above if the student has attended a previous
                  school
                </p>
              </div>
            )}
          </div>
        );

      case 5: // Documents
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-700" />
                  Required Documents
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  At least one document must be uploaded
                </p>
              </div>
              <Button
                type="button"
                onClick={addDocument}
                variant="outline"
                className="border-red-700 text-red-700 hover:bg-red-700 hover:text-white w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </div>

            {formData.documents.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No documents uploaded
                </h3>
                <p className="text-gray-500 mb-4">
                  At least one document is required to proceed
                </p>
                <Button
                  type="button"
                  onClick={addDocument}
                  className="bg-red-700 hover:bg-red-800 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload First Document
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {formData.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`docName-${index}`}>
                          Document Name <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          disabled={
                            edit &&
                            formData?.documents?.some(
                              (d) => d.name === doc.name && d.file === doc.file
                            )
                          }
                          id={`docName-${index}`}
                          value={doc.name}
                          onChange={(e) =>
                            updateDocument(index, "name", e.target.value)
                          }
                          placeholder="e.g., Birth Certificate, Aadhar Card"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`docFile-${index}`}>
                          Upload File <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id={`docFile-${index}`}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) =>
                              updateDocument(
                                index,
                                "file",
                                e.target.files?.[0] || null
                              )
                            }
                            className="flex-1 border-dashed border-2 border-gray-300 hover:border-red-400 transition-colors hidden"
                          />
                          {!formData.documents[index]?.file && (
                            <Label
                              htmlFor={`docFile-${index}`}
                              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 cursor-pointer transition"
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Choose
                            </Label>
                          )}
                          {formData.documents[index]?.file && (
                            <div className="flex-shrink-0">
                              <div className="relative">
                                <div className="flex items-center gap-2 justify-center">
                                  <div className="bg-red-100 p-1 rounded border border-red-700 max-w-sm w-full overflow-hidden">
                                    <span className="text-xs text-gray-600 px-2 py-1 flex items-center gap-2 justify-start text-ellipsis">
                                      <span>
                                        <File className="h-4 w-4" />
                                      </span>
                                      {(() => {
                                        const file =
                                          formData.documents[index]?.file;
                                        const name = file?.name;
                                        if (name) {
                                          return name.length > 10
                                            ? name.slice(0, 10) + "..."
                                            : name;
                                        }
                                        return file
                                          ? String(file)?.length > 10
                                            ? String(file).slice(0, 10) + "..."
                                            : String(file)
                                          : "No file chosen";
                                      })()}
                                    </span>
                                  </div>
                                  {formData.documents[index]?.file && (
                                    <Label
                                      htmlFor={`docFile-${index}`}
                                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 cursor-pointer transition"
                                    >
                                      <Repeat2 className="h-4 w-4" />
                                    </Label>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          <Button
                            type="button"
                            onClick={() => removeDocument(index)}
                            variant="outline"
                            size="icon"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 border-red-300"
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

            {/* Required documents list */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">
                Commonly Required Documents:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Birth Certificate</li>
                <li>• Transfer Certificate (if applicable)</li>
                <li>• Aadhar Card</li>
                <li>• Passport Size Photographs</li>
                <li>• Medical Certificate</li>
                <li>• Previous Year Mark Sheet</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Fetch student data if editing
  useEffect(() => {
    setLoading(true);
    if (edit && studentId) {
      fetchClasses();
      fetchStudentData(studentId);
    }
    setLoading(false);
  }, [edit, studentId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-xl p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-red-700" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {edit ? "Edit Student" : "Admission Form"}
                </h1>
                <p className="text-sm text-gray-500">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">
                Overall Progress
              </div>
              <div className="text-2xl font-bold text-red-700">
                {getOverallProgress(formData)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps - Fully Responsive */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-xl mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2 sm:gap-0 sm:flex-nowrap items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted =
                index < currentStep || isStepValid(formData, index);
              const isAccessible = index <= currentStep;

              return (
                <div
                  key={step.key}
                  className="flex items-center w-full sm:w-auto sm:min-w-0 sm:flex-1"
                >
                  <button
                    type="button"
                    onClick={() => isAccessible && goToStep(index)}
                    disabled={!isAccessible}
                    className={`flex items-center justify-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all duration-200 w-full text-left ${
                      isActive
                        ? "bg-red-700 text-white shadow-lg"
                        : isCompleted
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : isAccessible
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-gray-50 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${
                        isActive
                          ? "bg-white text-red-700"
                          : isCompleted
                          ? "bg-green-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {isCompleted && !isActive ? (
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <StepIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 hidden xl:flex items-center justify-between">
                      <div className="font-medium text-xs sm:text-sm hidden lg:flex items-center justify-between">
                        {step.label}
                      </div>
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="hidden sm:block flex-shrink-0 w-4 lg:w-8 h-px bg-gray-300 mx-1 lg:mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-red-100">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {React.createElement(steps[currentStep].icon, {
                className: "h-6 w-6 text-red-700",
              })}
              {steps[currentStep].label}
            </h2>
            <p className="text-gray-600 mt-1">
              {steps[currentStep].description}
            </p>
            <div className="mt-4">
              <Progress
                value={((currentStep + 1) / steps.length) * 100}
                className="h-2 bg-white"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6">{renderStepContent()}</div>

            {/* Navigation */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="text-sm text-gray-600 hidden sm:block">
                Step {currentStep + 1} of {steps.length}
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleReset}
                  className="bg-red-400 hover:bg-red-700 text-white border border-black flex items-center gap-1 w-full sm:w-auto"
                >
                  Reset Form
                  <LucideTimerReset className="h-4 w-4" />
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    disabled={!isStepValid(formData, currentStep)}
                    className="bg-red-700 hover:bg-red-800 text-white flex items-center gap-2 w-full sm:w-auto"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={loading || !isStepValid(formData, currentStep)}
                    onClick={handleSubmit}
                    className="bg-red-700 hover:bg-red-800 text-white flex items-center gap-2 w-full sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        {edit ? "Updating..." : "Submitting..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {edit ? "Update Student" : "Submit Admission"}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
