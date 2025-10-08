import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Plus,
  Save,
  AlertCircle,
  User,
  Hash,
  Edit,
  DollarSign,
  IndianRupee,
} from "lucide-react";
import { createClass, updateClassById } from "@/services/class.service";
import { getAllTeachers } from "@/services/teacher.service";

export function ClassForm({ edit = false, cls = null, fetchClasses = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attendeeList, setAttendeeList] = useState([]);
  const editClass = cls;

  const [formData, setFormData] = useState({
    className: "",
    classCode: "",
    attendee: "",
    fees: "",
  });

  useEffect(() => {
    async function fetchAttendees() {
      let attendees = await getAllTeachers();
      console.log(attendees);
      setAttendeeList(attendees || []);
    }
    fetchAttendees();
  }, []);

  useEffect(() => {
    if (isOpen && edit && editClass) {
      setFormData({
        className: editClass.className || "",
        classCode: editClass.classCode || "",
        attendee: editClass.attendee?._id || "",
        fees: editClass.fees ? editClass.fees.toString() : "",
      });
    } else if (isOpen && !edit) {
      setFormData({
        className: "",
        classCode: "",
        attendee: "",
        fees: "",
      });
    }
  }, [isOpen, edit, editClass]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatFeesDisplay = (value) => {
    if (!value) return "";
    const numericValue = value.replace(/[^\d.]/g, "");
    const number = parseFloat(numericValue);
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const handleFeesChange = (e) => {
    const rawValue = e.target.value;
    const cleanValue = rawValue.replace(/[^\d.]/g, "");
    const parts = cleanValue.split(".");
    const formattedValue =
      parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : cleanValue;
    handleInputChange("fees", formattedValue);
  };

  const getRawFeesValue = () => {
    if (!formData.fees) return null;
    const cleanValue = formData.fees.replace(/[^\d.]/g, "");
    const numericValue = parseFloat(cleanValue);
    return isNaN(numericValue) ? null : numericValue;
  };

  const handleReset = () => {
    setFormData({
      className: "",
      classCode: "",
      attendee: "",
      fees: "",
    });
    setLoading(false);
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const id = edit ? editClass._id : null;

    try {
      const payload = {
        ...formData,
        fees: getRawFeesValue(),
      };

      if (edit) {
        let updatedClass = await updateClassById(id, payload);
        if (updatedClass) {
          fetchClasses();
        }
      } else {
        let createdClass = await createClass(payload);
        if (createdClass) {
          fetchClasses();
        }
      }
      handleReset();
    } catch (error) {
      console.error("Error creating class:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    const requiredFields = [
      formData.className,
      formData.classCode,
      formData.fees,
    ];
    const completed = requiredFields.filter(
      (field) => field && field.toString().trim()
    ).length;
    return Math.round((completed / requiredFields.length) * 100);
  };

  const getSelectedAttendee = () => {
    return attendeeList.find((att) => att._id.toString() === formData.attendee);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {edit ? (
          <Button
            size="sm"
            variant="outline"
            className="border-gray-300 text-gray-700 hover:border-green-700 hover:text-green-700"
          >
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="bg-red-700 hover:bg-red-800 text-white shadow">
            <Plus className="h-4 w-4 mr-2" />
            Add New Class
          </Button>
        )}
      </SheetTrigger>

      {/* ✅ CRITICAL FIX: Remove nested form, proper structure */}
      <SheetContent
        side="right"
        className="!w-full sm:!w-[540px] md:!w-[700px] lg:!w-[800px] !max-w-none p-0 border-gray-200 [&>button]:hidden"
      >
        <div className="h-full flex flex-col">
          {/* Header - Fixed */}
          <div className="px-6 py-4 border-b border-gray-200 bg-red-50 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-700 rounded-lg flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <SheetTitle className="text-xl font-bold text-gray-900">
                    {edit ? "Edit Class" : "Add New Class"}
                  </SheetTitle>
                  <SheetDescription className="text-gray-600 text-sm">
                    {edit
                      ? "Edit the class details"
                      : "Create a new class for your institution"}
                  </SheetDescription>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-shrink-0 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Form Completion
                </span>
                <span className="text-sm text-gray-600">
                  {calculateProgress()}%
                </span>
              </div>
              <Progress value={calculateProgress()} className="h-2 bg-white" />
            </div>
          </div>

          {/* ✅ FIXED: Use div with overflow-auto instead of problematic ScrollArea */}
          <div className="flex-1 overflow-auto">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="flex-1 px-6 py-6 space-y-6">
                {/* Class Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-red-700" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Class Information
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Class Name */}
                      <div className="space-y-2 flex-1">
                        <Label
                          htmlFor="className"
                          className="text-gray-700 font-medium"
                        >
                          Class Name <span className="text-red-700">*</span>
                        </Label>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                          <Input
                            id="className"
                            value={formData.className}
                            onChange={(e) =>
                              handleInputChange("className", e.target.value)
                            }
                            placeholder="e.g., Grade 1, Class 5A"
                            className="border-gray-200 focus:border-red-700 focus:ring-red-700 pl-10"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Example: Grade 1, Class 5A, Mathematics Advanced
                        </p>
                      </div>

                      {/* Class Code */}
                      <div className="space-y-2 flex-1">
                        <Label
                          htmlFor="classCode"
                          className="text-gray-700 font-medium"
                        >
                          Class Code <span className="text-red-700">*</span>
                        </Label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                          <Input
                            id="classCode"
                            value={formData.classCode}
                            onChange={(e) =>
                              handleInputChange(
                                "classCode",
                                e.target.value.toUpperCase()
                              )
                            }
                            placeholder="e.g., G1A, CLS5A"
                            className="border-gray-200 focus:border-red-700 focus:ring-red-700 pl-10"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Unique identifier (letters and numbers only)
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Fees Field */}
                      <div className="space-y-2 flex-1">
                        <Label
                          htmlFor="fees"
                          className="text-gray-700 font-medium"
                        >
                          Class Fees <span className="text-red-700">*</span>
                        </Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                          <Input
                            id="fees"
                            type="text"
                            value={formData.fees}
                            onChange={handleFeesChange}
                            placeholder="Enter fees amount"
                            className="border-gray-200 focus:border-red-700 focus:ring-red-700 pl-10"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Annual fees for this class (e.g., 15000, 25000.50)
                        </p>
                        {formData.fees && (
                          <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-xs text-green-800 font-medium">
                              Formatted: ₹{formatFeesDisplay(formData.fees)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Attendee Dropdown */}
                      <div className="space-y-2 flex-1">
                        <Label
                          htmlFor="attendee"
                          className="text-gray-700 font-medium"
                        >
                          Class Attendee/Teacher
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 z-10 pointer-events-none" />
                          <Select
                            value={formData.attendee}
                            onValueChange={(value) =>
                              handleInputChange("attendee", value)
                            }
                          >
                            <SelectTrigger className="border-gray-200 focus:border-red-700 focus:ring-red-700 pl-10">
                              <SelectValue placeholder="Select a teacher/attendee" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {attendeeList.length === 0 ? (
                                <div className="p-4 text-sm text-gray-500 text-center">
                                  No teachers available
                                </div>
                              ) : (
                                attendeeList.map((attendee) => (
                                  <SelectItem
                                    key={attendee._id}
                                    value={attendee._id}
                                  >
                                    <div className="flex flex-col py-1">
                                      <span className="font-medium">
                                        {attendee.name}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {attendee?.username}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-xs text-gray-500">
                          Select the teacher responsible for this class
                        </p>

                        {formData.attendee && getSelectedAttendee() && (
                          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-red-700 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {getSelectedAttendee()?.name}
                                </p>
                                <p className="text-xs text-gray-600 truncate">
                                  {getSelectedAttendee()?.username} •{" "}
                                  {getSelectedAttendee()?.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form Guidelines */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">
                          Required Information:
                        </p>
                        <ul className="text-xs space-y-1 list-disc list-inside">
                          <li>Class Name: A descriptive name for the class</li>
                          <li>
                            Class Code: Unique identifier (auto-uppercase)
                          </li>
                          <li>
                            Class Fees: Annual fees (numeric, decimals allowed)
                          </li>
                          <li>Attendee: Optional teacher assignment</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Fees Summary */}
                  {formData.fees && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-purple-800">
                          <p className="font-medium mb-1">Fees Summary</p>
                          <p className="text-xs">
                            Total annual fees:{" "}
                            <span className="font-bold">
                              ₹{formatFeesDisplay(formData.fees)}
                            </span>
                          </p>
                          <p className="text-xs mt-1">
                            This amount will be charged to students enrolled in
                            this class.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer - Fixed at bottom */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={
                      loading ||
                      !formData.className ||
                      !formData.classCode ||
                      !formData.fees
                    }
                    className="bg-red-700 hover:bg-red-800 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        {edit ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {edit ? "Update Class" : "Create Class"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
