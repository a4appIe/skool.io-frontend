import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, MenuIcon, User, Plus, Save, Edit } from "lucide-react";
import { toast } from "sonner";
import { createSubject, updateSubjectById } from "@/services/subject.service";

const attendeeList = [
  {
    id: 1,
    name: "Ms. Sarah Johnson",
    department: "Mathematics",
    email: "sarah.johnson@school.edu",
  },
  {
    id: 2,
    name: "Mr. David Smith",
    department: "Science",
    email: "david.smith@school.edu",
  },
  {
    id: 3,
    name: "Mrs. Emily Davis",
    department: "English",
    email: "emily.davis@school.edu",
  },
  {
    id: 4,
    name: "Mr. Michaeledu",
  },
  {
    id: 5,
    name: "Ms. Jennifer Wilson",
    department: "Art",
    email: "jennifer.wilson@school.edu",
  },
  {
    id: 6,
    name: "Mr. Robert Taylor",
    department: "Physical Education",
    email: "robert.taylor@school.edu",
  },
  {
    id: 7,
    name: "Mrs. Lisa Anderson",
    department: "Music",
    email: "lisa.anderson@school.edu",
  },
  {
    id: 8,
    name: "Mr. James Martinez",
    department: "Computer Science",
    email: "james.martinez@school.edu",
  },
  {
    id: 9,
    name: "Ms. Amanda Garcia",
    department: "Spanish",
    email: "amanda.garcia@school.edu",
  },
  {
    id: 10,
    name: "Mr. Christopher Lee",
    department: "Chemistry",
    email: "christopher.lee@school.edu",
  },
];

// Utility for progress calculation based on required fields
function calcProgress(subject) {
  const requiredFields = [subject?.subjectName, subject?.subjectCode];
  const completed = requiredFields.filter(
    (f) => f && f.toString().trim()
  ).length;
  return Math.round((completed / requiredFields.length) * 100);
}

export function SubjectForm({ edit = false, subject = null }) {
  // Control sheet open state here or pass from parent
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Local form state
  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    description: "",
    attendee: "",
  });

  // Sync formData with subject prop when editing and sheet opens
  useEffect(() => {
    if (isOpen) {
      if (edit && subject) {
        setFormData({
          subjectName: subject.subjectName || "",
          subjectCode: subject.subjectCode || "",
          description: subject.description || "",
          attendee: subject.attendee ? subject.attendee.toString() : "",
        });
      } else {
        // New subject reset
        setFormData({
          subjectName: "",
          subjectCode: "",
          description: "",
          attendee: "",
        });
      }
    }
  }, [isOpen, edit, subject]);

  // Update formData helper
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Get selected attendee object by id
  const selectedAttendee = attendeeList.find(
    (a) => a.id.toString() === formData.attendee
  );

  // Form submit handler mock
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic front-end validation:
    if (!formData.subjectName || !formData.subjectCode) {
      return toast.error("Please fill in all required fields.");
    }

    setLoading(true);
    try {
      if (edit) {
        await updateSubjectById(subject._id, formData);
      } else {
        await createSubject(formData);
      }
      setIsOpen(false);
      setFormData({
        subjectName: "",
        subjectCode: "",
        description: "",
        attendee: "",
      });
    } catch (error) {
      console.error(error);
      //   alert("Failed to save subject. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {edit ? (
          <Button size="sm" variant="outline" className="border-gray-300">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="bg-red-700 hover:bg-red-800 text-white shadow">
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="right"
        className="!w-full md:!w-[800px] !max-w-none p-0 border-gray-200 [&>button.absolute]:hidden"
      >
        <ScrollArea className="h-full">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <SheetHeader className="px-6 py-4 border-b border-gray-200 bg-red-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-700 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <SheetTitle className="text-xl font-bold text-gray-900">
                      {edit ? "Edit Subject" : "Add New Subject"}
                    </SheetTitle>
                    <SheetDescription className="text-gray-600">
                      {edit
                        ? "Update details of the subject."
                        : "Add details to create a new subject."}
                    </SheetDescription>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
              </div>

              <div className="mt-4">
                <Progress value={calcProgress(formData)} className="h-2" />
                <div className="flex justify-between text-sm text-gray-700 mt-1">
                  <span>Form Completion</span>
                  <span>{calcProgress(formData)}%</span>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-auto px-6 py-6">
              {/* Subject Name */}
              <div className="space-y-2 mb-6">
                <Label
                  htmlFor="subjectName"
                  className="text-gray-700 font-medium"
                >
                  Subject Name <span className="text-red-700">*</span>
                </Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="subjectName"
                    value={formData.subjectName}
                    onChange={(e) =>
                      handleChange("subjectName", e.target.value)
                    }
                    placeholder="Subject name e.g. Mathematics"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Subject Code */}
              <div className="space-y-2 mb-6">
                <Label
                  htmlFor="subjectCode"
                  className="text-gray-700 font-medium"
                >
                  Subject Code <span className="text-red-700">*</span>
                </Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="subjectCode"
                    value={formData.subjectCode}
                    onChange={(e) =>
                      handleChange("subjectCode", e.target.value.toUpperCase())
                    }
                    placeholder="Subject code e.g. MATH101"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Attendee */}
              <div className="space-y-2 mb-6">
                <Label htmlFor="attendee" className="text-gray-700 font-medium">
                  Subject Attendee (Teacher){" "}
                  <span className="text-red-700">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Select
                    value={formData.attendee}
                    onValueChange={(val) => handleChange("attendee", val)}
                    required
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {attendeeList.map((att) => (
                        <SelectItem key={att.id} value={att.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{att.name}</span>
                            <span className="text-xs text-gray-500">
                              {att.department ? att.department + " • " : ""}
                              {att.email || ""}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.attendee && (
                  <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center gap-3">
                    <User className="text-red-700 h-5 w-5" />
                    <div>
                      <p className="text-sm font-semibold">
                        {selectedAttendee?.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {selectedAttendee?.department}{" "}
                        {selectedAttendee?.email &&
                          `• ${selectedAttendee.email}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 mb-6">
                <Label
                  htmlFor="description"
                  className="text-gray-700 font-medium"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  placeholder="Optional description about the subject"
                />
              </div>
            </div>

            <SheetFooter className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-end justify-end gap-3">
              <Button
                type="submit"
                className="bg-red-700"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !formData.subjectName.trim() ||
                  !formData.subjectCode.trim()
                }
              >
                {loading ? (
                  <>
                    <span className="animate-spin spinner-border spinner-border-sm mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-1 h-4 w-4" />
                    {edit ? "Update Subject" : "Create Subject"}
                  </>
                )}
              </Button>
            </SheetFooter>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
