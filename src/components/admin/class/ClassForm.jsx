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
} from "lucide-react";
import { createClass, updateClassById } from "@/services/class.service";
import { getAllTeachers } from "@/services/teacher.service";

export function ClassForm({ edit = false, cls = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attendeeList, setAttendeeList] = useState([]);
  const editClass = cls;

  // Form state management
  const [formData, setFormData] = useState({
    className: "",
    classCode: "",
    attendee: "",
  });

  useEffect(() => {
    async function fetchAttendees() {
      let attendees = await getAllTeachers();
      console.log(attendees);
      setAttendeeList(attendees || []);
    }
    fetchAttendees();
  }, []);

  // Sync data when editing and sheet gets opened!
  useEffect(() => {
    if (isOpen && edit && editClass) {
      setFormData({
        className: editClass.className || "",
        classCode: editClass.classCode || "",
        attendee: editClass.attendee?._id || "",
      });
    } else if (isOpen && !edit) {
      setFormData({
        className: "",
        classCode: "",
        attendee: "",
      });
    }
  }, [isOpen, edit, editClass]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      className: "",
      classCode: "",
      attendee: "",
    });
    setLoading(false);
    setIsOpen(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const id = edit ? editClass._id : null;
    try {
      if (edit) {
        await updateClassById(id, formData);
      } else {
        await createClass(formData);
      }
      // Reset form and close sheet
      handleReset();
    } catch (error) {
      console.error("Error creating class:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate form completion
  const calculateProgress = () => {
    const requiredFields = [formData.className, formData.classCode];
    const completed = requiredFields.filter(
      (field) => field && field.toString().trim()
    ).length;
    return Math.round((completed / requiredFields.length) * 100);
  };

  // Get selected attendee details for display
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
            className={`border-gray-300 text-gray-700 hover:border-green-700 hover:text-green-700`}
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
      <SheetContent
        side="right"
        className="!w-full md:!w-[800px] !max-w-none p-0 border-gray-200 [&>button.absolute]:hidden"
      >
        <ScrollArea className="h-full">
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="px-6 py-4 border-b border-gray-200 bg-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-700 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <SheetTitle className="text-xl font-bold text-gray-900">
                      {edit ? "Edit Class" : "Add New Class"}
                    </SheetTitle>
                    <SheetDescription className="text-gray-600">
                      {edit
                        ? "Edit the class details"
                        : "Create a new class for your institution"}
                    </SheetDescription>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
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
                {/* Class Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="h-5 w-5 text-red-700" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Class Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Class Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="className"
                        className="text-gray-700 font-medium"
                      >
                        Class Name <span className="text-red-700">*</span>
                      </Label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="className"
                          value={formData.className}
                          onChange={(e) =>
                            handleInputChange("className", e.target.value)
                          }
                          placeholder="Enter class name (e.g., Grade 1, Class A)"
                          className="border-gray-200 focus:border-red-700 focus:ring-red-700 pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Example: Grade 1, Class 5A, Mathematics Advanced
                      </p>
                    </div>

                    {/* Class Code */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="classCode"
                        className="text-gray-700 font-medium"
                      >
                        Class Code <span className="text-red-700">*</span>
                      </Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="classCode"
                          value={formData.classCode}
                          onChange={(e) =>
                            handleInputChange(
                              "classCode",
                              e.target.value.toUpperCase()
                            )
                          }
                          placeholder="Enter class code (e.g., G1A, CLS5A)"
                          className="border-gray-200 focus:border-red-700 focus:ring-red-700 pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Unique identifier for the class (letters and numbers
                        only)
                      </p>
                    </div>

                    {/* Attendee Dropdown */}
                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="attendee"
                        className="text-gray-700 font-medium"
                      >
                        Class Attendee/Teacher{" "}
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
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
                            {attendeeList.map((attendee) => (
                              <SelectItem
                                key={attendee._id}
                                value={attendee._id}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {attendee.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {attendee?.username}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-gray-500">
                        Select the teacher or person responsible for this class
                      </p>

                      {/* Display selected attendee details */}
                      {formData.attendee && (
                        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-red-700" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {getSelectedAttendee()?.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {getSelectedAttendee()?.username} •{" "}
                                {getSelectedAttendee()?.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Guidelines */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">
                          Required Information:
                        </p>
                        <ul className="text-xs space-y-1 list-disc list-inside">
                          <li>Class Name: A descriptive name for the class</li>
                          <li>
                            Class Code: A unique identifier (automatically
                            converted to uppercase)
                          </li>
                          <li>
                            Attendee: Select from the list of available teachers
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Available Attendees Summary */}
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-green-800">
                        <p className="font-medium mb-1">
                          Available Teachers: {attendeeList.length}
                        </p>
                        <p className="text-xs">
                          Choose from our qualified teaching staff across
                          different departments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Actions */}
            <SheetFooter className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-3 w-full justify-end">
                {/* <Button
                  type="button"
                  variant="outline"
                  className="border-red-700 text-red-700 hover:bg-red-700 hover:text-white"
                >
                  Save as Draft
                </Button> */}
                <Button
                  type="submit"
                  disabled={
                    loading || !formData.className || !formData.classCode
                  }
                  className="bg-red-700 hover:bg-red-800 text-white flex-1 sm:flex-none"
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {edit ? <>Updating...</> : <>Creating...</>}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {edit ? <>Update Class</> : <>Create Class</>}
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
