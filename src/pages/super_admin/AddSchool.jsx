import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  School,
  MapPin,
  Phone,
  Upload,
  FileText,
  Plus,
  X,
  Save,
  Eye,
  Edit,
  Image,
  File,
  User,
  Lock,
  EyeOff,
} from "lucide-react";
import { registerSchool } from "@/services/school.service";

export function AddSchool() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state management - Updated with username and password fields
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    ownerName: "",
    udiseCode: "",
    board: "",
    affiliationNumber: "",
    recognition: "",
    yearEstablished: "",
    username: "",
    password: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
    },
    contact: {
      landline: "",
      phone: "",
      email: "",
      website: "",
    },
    logo: null,
    banner: null,
    mediumOfInstruction: [],
    documents: [],
  });

  // Available options
  const boards = ["CBSE", "ICSE", "State Board", "IB", "Cambridge"];
  const recognitionTypes = ["Private", "Government", "Aided", "Unaided"];
  const instructionMediums = ["English", "Hindi", "Urdu", "Regional Language"];

  // Handle input changes
  const handleInputChange = (field, value, section = null) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Handle file uploads
  const handleFileChange = (field, file) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  // Handle medium of instruction
  const handleMediumChange = (medium, checked) => {
    setFormData((prev) => ({
      ...prev,
      mediumOfInstruction: checked
        ? [...prev.mediumOfInstruction, medium]
        : prev.mediumOfInstruction.filter((m) => m !== medium),
    }));
  };

  // Handle document management
  const addDocument = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, { name: "", file: null }],
    }));
  };

  const updateDocument = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.map((doc, i) =>
        i === index ? { ...doc, [field]: value } : doc
      ),
    }));
  };

  const removeDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleClearForm = () => {
    setFormData({
      name: "",
      code: "",
      ownerName: "",
      udiseCode: "",
      board: "",
      affiliationNumber: "",
      recognition: "",
      yearEstablished: "",
      username: "",
      password: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        country: "India",
        postalCode: "",
      },
      contact: {
        landline: "",
        phone: "",
        email: "",
        website: "",
      },
      logo: null,
      banner: null,
      mediumOfInstruction: [],
      documents: [],
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      // Create FormData for file upload
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "address" || key === "contact") {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === "mediumOfInstruction") {
          formData[key].forEach((medium) => {
            submitData.append("mediumOfInstruction[]", medium);
          });
        } else if (key === "logo" || key === "banner") {
          if (formData[key]) {
            submitData.append(key, formData[key]);
          }
        } else if (key === "documents") {
          formData[key].forEach((doc) => {
            if (doc.file) {
              submitData.append("documents", doc.file);
              submitData.append("documentNames", doc.name);
            }
          });
        } else {
          submitData.append(key, formData[key]);
        }
      });
      // Simulate API call with file upload
      try {
        await registerSchool(submitData);
      } catch (error) {
        console.error("Error:", error);
        return;
      } finally {
        setLoading(false);
      }
      // Reset form and close sheet
      handleClearForm();
      setIsOpen(false);
      setShowPassword(false);
    } catch (error) {
      console.error("Error creating school:", error);
      alert("Error creating school. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate form completion - Updated to include username and password
  const calculateProgress = () => {
    const requiredFields = [
      formData.name,
      formData.code,
      formData.udiseCode,
      formData.board,
      formData.username,
      formData.password,
      formData.contact.email,
      formData.contact.phone,
      formData.address.city,
    ];
    const completed = requiredFields.filter(
      (field) => field && field.toString().trim()
    ).length;
    return Math.round((completed / requiredFields.length) * 100);
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Reset form when opening
  const handleOpenChange = (open) => {
    if (!open) {
      setShowPassword(false);
    }
    setIsOpen(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="bg-red-700 hover:bg-red-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New School
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="!w-full sm:!w-[1000px] !max-w-none p-0 border-gray-200 [&>button.absolute]:hidden"
      >
        <ScrollArea className="h-full">
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="px-6 py-4 border-b border-gray-200 bg-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-700 rounded-lg">
                    <School className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <SheetTitle className="text-xl font-bold text-gray-900">
                      Add New School
                    </SheetTitle>
                    <SheetDescription className="text-gray-600">
                      Create a new educational institution profile
                    </SheetDescription>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Form Completion
                  </span>
                  <span className="text-sm text-gray-600">
                    {calculateProgress()}%
                  </span>
                </div>
                <Progress
                  value={calculateProgress()}
                  className="h-2 bg-white"
                />
              </div>
            </SheetHeader>

            {/* Form Content */}
            <div className="flex-1 px-6 py-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <School className="h-5 w-5 text-red-700" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Basic Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-gray-700 font-medium"
                      >
                        School Name <span className="text-red-700">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter school name"
                        className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="code"
                        className="text-gray-700 font-medium"
                      >
                        School Code <span className="text-red-700">*</span>
                      </Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) =>
                          handleInputChange("code", e.target.value)
                        }
                        placeholder="Enter school code"
                        className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="udiseCode"
                        className="text-gray-700 font-medium"
                      >
                        UDISE Code <span className="text-red-700">*</span>
                      </Label>
                      <Input
                        id="udiseCode"
                        value={formData.udiseCode}
                        onChange={(e) =>
                          handleInputChange("udiseCode", e.target.value)
                        }
                        placeholder="Enter UDISE code"
                        className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="yearEstablished"
                        className="text-gray-700 font-medium"
                      >
                        Year Established
                      </Label>
                      <Input
                        id="yearEstablished"
                        type="number"
                        value={formData.yearEstablished}
                        onChange={(e) =>
                          handleInputChange("yearEstablished", e.target.value)
                        }
                        placeholder="Enter establishment year"
                        className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="ownerName"
                          className="text-gray-700 font-medium"
                        >
                          Owner Name <span className="text-red-700">*</span>
                        </Label>
                        <Input
                          id="ownerName"
                          value={formData.ownerName}
                          onChange={(e) =>
                            handleInputChange("ownerName", e.target.value)
                          }
                          placeholder="Enter owner name"
                          className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="board"
                          className="text-gray-700 font-medium"
                        >
                          Board <span className="text-red-700">*</span>
                        </Label>
                        <Select
                          value={formData.board}
                          onValueChange={(value) =>
                            handleInputChange("board", value)
                          }
                        >
                          <SelectTrigger className="border-gray-200 focus:border-red-700 focus:ring-red-700">
                            <SelectValue placeholder="Select board" />
                          </SelectTrigger>
                          <SelectContent>
                            {boards.map((board) => (
                              <SelectItem key={board} value={board}>
                                {board}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="recognition"
                        className="text-gray-700 font-medium"
                      >
                        Recognition Type
                      </Label>
                      <Select
                        value={formData.recognition}
                        onValueChange={(value) =>
                          handleInputChange("recognition", value)
                        }
                      >
                        <SelectTrigger className="border-gray-200 focus:border-red-700 focus:ring-red-700">
                          <SelectValue placeholder="Select recognition type" />
                        </SelectTrigger>
                        <SelectContent>
                          {recognitionTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* NEW: Username Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="username"
                        className="text-gray-700 font-medium"
                      >
                        Username <span className="text-red-700">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) =>
                            handleInputChange("username", e.target.value)
                          }
                          placeholder="Enter username"
                          className="border-gray-200 focus:border-red-700 focus:ring-red-700 pl-10"
                        />
                      </div>
                    </div>

                    {/* NEW: Password Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-gray-700 font-medium"
                      >
                        Password <span className="text-red-700">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          placeholder="Enter password"
                          className="border-gray-200 focus:border-red-700 focus:ring-red-700 pl-10 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="affiliationNumber"
                      className="text-gray-700 font-medium"
                    >
                      Affiliation Number
                    </Label>
                    <Input
                      id="affiliationNumber"
                      value={formData.affiliationNumber}
                      onChange={(e) =>
                        handleInputChange("affiliationNumber", e.target.value)
                      }
                      placeholder="Enter affiliation number"
                      className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                    />
                  </div>
                </div>

                {/* Rest of the form sections remain the same... */}
                {/* Address Information, Contact Information, Medium of Instruction, Media & Documents sections stay exactly as they were */}

                <Separator className="my-6" />

                {/* Address Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-red-700" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Address Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="line1"
                        className="text-gray-700 font-medium"
                      >
                        Address Line 1 <span className="text-red-700">*</span>
                      </Label>
                      <Input
                        id="line1"
                        value={formData.address.line1}
                        onChange={(e) =>
                          handleInputChange("line1", e.target.value, "address")
                        }
                        placeholder="Street address, building name"
                        className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="line2"
                        className="text-gray-700 font-medium"
                      >
                        Address Line 2
                      </Label>
                      <Input
                        id="line2"
                        value={formData.address.line2}
                        onChange={(e) =>
                          handleInputChange("line2", e.target.value, "address")
                        }
                        placeholder="Area, locality"
                        className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="city"
                        className="text-gray-700 font-medium"
                      >
                        City <span className="text-red-700">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={formData.address.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value, "address")
                        }
                        placeholder="Enter city"
                        className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="state"
                        className="text-gray-700 font-medium"
                      >
                        State <span className="text-red-700">*</span>
                      </Label>
                      <Input
                        id="state"
                        value={formData.address.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value, "address")
                        }
                        placeholder="Enter state"
                        className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="country"
                        className="text-gray-700 font-medium"
                      >
                        Country
                      </Label>
                      <Input
                        id="country"
                        value={formData.address.country}
                        onChange={(e) =>
                          handleInputChange(
                            "country",
                            e.target.value,
                            "address"
                          )
                        }
                        placeholder="Enter country"
                        className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="postalCode"
                        className="text-gray-700 font-medium"
                      >
                        Postal Code <span className="text-red-700">*</span>
                      </Label>
                      <Input
                        id="postalCode"
                        value={formData.address.postalCode}
                        onChange={(e) =>
                          handleInputChange(
                            "postalCode",
                            e.target.value,
                            "address"
                          )
                        }
                        placeholder="Enter postal code"
                        className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Phone className="h-5 w-5 text-red-700" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Contact Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="landline"
                        className="text-gray-700 font-medium"
                      >
                        Landline Number
                      </Label>
                      <Input
                        id="landline"
                        value={formData.contact.landline}
                        onChange={(e) =>
                          handleInputChange(
                            "landline",
                            e.target.value,
                            "contact"
                          )
                        }
                        placeholder="Enter landline number"
                        className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-gray-700 font-medium"
                      >
                        Mobile Number <span className="text-red-700">*</span>
                      </Label>
                      <Input
                        id="phone"
                        value={formData.contact.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value, "contact")
                        }
                        placeholder="Enter mobile number"
                        className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-gray-700 font-medium"
                      >
                        Email Address <span className="text-red-700">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.contact.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value, "contact")
                        }
                        placeholder="Enter email address"
                        className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="website"
                        className="text-gray-700 font-medium"
                      >
                        Website URL
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.contact.website}
                        onChange={(e) =>
                          handleInputChange(
                            "website",
                            e.target.value,
                            "contact"
                          )
                        }
                        placeholder="https://www.example.com"
                        className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Medium of Instruction */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-red-700" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Medium of Instruction
                    </h3>
                  </div>

                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {instructionMediums.map((medium) => (
                        <div
                          key={medium}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={medium}
                            checked={formData.mediumOfInstruction.includes(
                              medium
                            )}
                            onCheckedChange={(checked) =>
                              handleMediumChange(medium, checked)
                            }
                            className="border-gray-200 data-[state=checked]:bg-red-700 data-[state=checked]:border-red-700"
                          />
                          <Label
                            htmlFor={medium}
                            className="text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            {medium}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formData.mediumOfInstruction.map((medium) => (
                        <Badge
                          key={medium}
                          className="bg-red-700 hover:bg-red-800 text-white"
                        >
                          {medium}
                        </Badge>
                      ))}
                    </div>
                  </>
                </div>

                <Separator className="my-6" />

                {/* Media & Documents */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Upload className="h-5 w-5 text-red-700" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Media & Documents
                    </h3>
                  </div>

                  {/* Logo and Banner File Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="logo"
                        className="text-gray-700 font-medium"
                      >
                        School Logo
                      </Label>
                      <div className="space-y-2">
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange("logo", e.target.files[0])
                          }
                          className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                        />
                        {formData.logo && (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-2">
                              <Image className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">
                                {formData.logo.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {formatFileSize(formData.logo.size)}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleFileChange("logoFile", null)
                                }
                                className="h-6 w-6 text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Banner Upload */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="banner"
                        className="text-gray-700 font-medium"
                      >
                        School Banner
                      </Label>
                      <div className="space-y-2">
                        <Input
                          id="banner"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange("banner", e.target.files[0])
                          }
                          className="border-gray-200 focus:border-red-700 focus:ring-red-700"
                        />
                        {formData.banner && (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-2">
                              <Image className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">
                                {formData.banner.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {formatFileSize(formData.banner.size)}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleFileChange("banner", null)}
                                className="h-6 w-6 text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-medium text-gray-900">
                        Documents
                      </h4>
                      <Button
                        type="button"
                        onClick={addDocument}
                        variant="outline"
                        size="sm"
                        className="border-red-700 text-red-700 hover:bg-red-700 hover:text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Document
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {formData.documents.length > 0 ? (
                        formData.documents.map((document, index) => (
                          <div
                            key={index}
                            className="flex gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
                          >
                            <FileText className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                              <>
                                <Input
                                  value={document.name}
                                  onChange={(e) =>
                                    updateDocument(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Document name"
                                  className="border-gray-200 focus:border-red-700 focus:ring-red-700 bg-white"
                                />
                                <div className="space-y-2">
                                  <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) =>
                                      updateDocument(
                                        index,
                                        "file",
                                        e.target.files[0]
                                      )
                                    }
                                    className="border-gray-200 focus:border-red-700 focus:ring-red-700 bg-white"
                                  />
                                  {document.file && (
                                    <div className="flex items-center justify-between p-2 bg-white rounded-md border">
                                      <div className="flex items-center gap-2">
                                        <File className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">
                                          {document.file.name}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">
                                          {formatFileSize(document.file.size)}
                                        </span>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            updateDocument(index, "file", null)
                                          }
                                          className="h-6 w-6 text-red-600 hover:text-red-800 hover:bg-red-50"
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </>
                            </div>
                            <Button
                              type="button"
                              onClick={() => removeDocument(index)}
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 italic">
                          No documents added yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Actions */}
            <SheetFooter className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col justify-end sm:flex-row gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="border-red-700 text-red-700 hover:bg-red-700 hover:text-white"
                >
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-red-700 hover:bg-red-800 text-white flex-1 sm:flex-none"
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create School
                    </>
                  )}
                </Button>
              </div>
            </SheetFooter>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
