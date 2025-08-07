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
  Phone,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import createFormDataTeacher from "./fns/createFormDataTeacher";
import {
  getTeacher,
  registerTeacher,
  updateTeacher,
} from "@/services/teacher.service";
import createFormDataTeacherEdit from "./fns/createFormDataTeacherEdit";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const CATEGORIES = ["General", "OBC", "SC", "ST", "Other"];
const GENDERS = ["Male", "Female", "Other"];

// Steps configuration
const steps = [
  {
    label: "Personal",
    key: "personal",
    icon: User,
    description: "Teacher's personal information",
  },
  {
    label: "Contact",
    key: "contact",
    icon: Hash,
    description: "Contact and address details",
  },
  {
    label: "Professional",
    key: "professional",
    icon: BookOpen,
    description: "Qualification and experience",
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
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(
    edit ? null : { ...initialFormState }
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const TEACHER_PATH = import.meta.env.VITE_TEACHER_PATH;

  const fetchTeacherData = async () => {
    if (edit && teacherId) {
      setLoading(true);
      try {
        const teacherData = await getTeacher(teacherId);
        setFormData({
          ...teacherData,
        });
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Validation functions
  function isStepValid(form, stepIndex) {
    if (!formData) return false; // Ensure form is loaded
    if (edit) return true;

    switch (stepIndex) {
      case 0: // Personal Details
        return !edit
          ? !!(
              form.name &&
              form.password &&
              form.gender &&
              form.dob &&
              form.category &&
              form.aadharNumber &&
              form.teacherImage
            )
          : true;

      case 1: // Contact & Address
        return !edit
          ? !!(
              form.email &&
              form.phone &&
              form.address.city &&
              form.address.state &&
              form.address.pincode
            )
          : true;

      case 2: // Professional Information
        return !edit
          ? !!(form.qualification && (form.experience || form.experience === 0))
          : true;

      case 3: // Documents
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
        const fd = createFormDataTeacherEdit(formData);
        // Debugging output
        console.log("Final FormData:");
        for (let pair of fd.entries()) {
          console.log(pair[0], pair[1]);
        }
        await updateTeacher(formData._id, fd);
      } else {
        const fd = createFormDataTeacher(formData);
        // Debugging output
        console.log("Final FormData:");
        for (let pair of fd.entries()) {
          console.log(pair[0], pair[1]);
        }
        await registerTeacher(fd);
      }
      // Clear saved data after successful submission
      setFormData(initialFormState);
      setCurrentStep(0);
      navigate("/school/teachers");
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
  };

  // Step content renderer
  const renderStepContent = () => {
    if (!formData) return null;

    switch (currentStep) {
      case 0: // Personal Details
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="name">
                  Teacher Name <span className="text-red-600">*</span>
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

            {/* Teacher Photo Section */}
            <div className="border-t pt-6">
              <div className="space-y-4">
                <Label
                  className="text-lg font-semibold flex items-center gap-2"
                  htmlFor="teacherImage"
                >
                  <Camera className="h-5 w-5 text-red-700" />
                  Teacher Photo <span className="text-red-600">*</span>
                </Label>

                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      id="teacherImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        console.log(e.target.files);
                        return updateFormField(
                          "teacherImage",
                          e.target.files?.[0] || null
                        );
                      }}
                      className="hidden border-dashed border-2 border-gray-300 hover:border-red-400 transition-colors"
                    />
                    <div className="flex items-center gap-2">
                      {!formData.teacherImage && (
                        <Label
                          htmlFor="teacherImage"
                          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 cursor-pointer transition"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Choose Image
                        </Label>
                      )}
                      {formData.teacherImage && (
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              src={
                                typeof formData.teacherImage === "string"
                                  ? `${TEACHER_PATH}/${formData.teacherImage}`
                                  : URL.createObjectURL(formData.teacherImage)
                              }
                              alt="Teacher preview"
                              className="w-32 h-40 object-cover border-2 border-gray-200 rounded-lg shadow-sm"
                            />
                            <Button
                              type="button"
                              onClick={() =>
                                updateFormField("teacherImage", null)
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

      case 1: // Contact & Address
        return (
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-800">
                <Phone className="h-5 w-5" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-600">*</span>
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
                    Phone <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      updateFormField(
                        "phone",
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="Enter phone number"
                    maxLength={15}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-800">
                <MapPin className="h-5 w-5" />
                Address Information
              </h3>
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
          </div>
        );

      case 2: // Professional Information
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-800">
                <BookOpen className="h-5 w-5" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="qualification">
                    Qualification <span className="text-red-600">*</span>
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
                    Experience (Years) <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={(e) =>
                      updateFormField(
                        "experience",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="Enter years of experience"
                  />
                </div>
              </div>
            </div>

            {/* Additional Professional Details */}
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-800">
                <GraduationCap className="h-5 w-5" />
                Additional Information
              </h3>
              <div className="text-sm text-orange-800 space-y-2">
                <p>
                  • Please ensure all qualification documents are ready for
                  upload
                </p>
                <p>
                  • Experience certificate from previous institutions may be
                  required
                </p>
                <p>
                  • Professional development certificates can be uploaded in the
                  documents section
                </p>
              </div>
            </div>
          </div>
        );

      case 3: // Documents
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
                          id={`docName-${index}`}
                          value={doc.name}
                          onChange={(e) =>
                            updateDocument(index, "name", e.target.value)
                          }
                          placeholder="e.g., Degree Certificate, Experience Letter"
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
                Commonly Required Documents for Teachers:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Educational Qualification Certificates</li>
                <li>• Teaching Qualification (B.Ed/M.Ed)</li>
                <li>• Experience Certificates</li>
                <li>• Identity Proof (Aadhar Card/PAN Card)</li>
                <li>• Address Proof</li>
                <li>• Passport Size Photographs</li>
                <li>• Medical Certificate</li>
                <li>• No Objection Certificate (if applicable)</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Fetch teacher data if editing
  useEffect(() => {
    fetchTeacherData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-red-700" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {edit ? "Edit Teacher" : "Recruit Teacher"}
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
      <div className="bg-white border-b border-gray-200">
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
                        {edit ? "Update Teacher" : "Submit Recruitment"}
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
