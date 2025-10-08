/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
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
import { BookOpen, User, Plus, Save, Edit, Users } from "lucide-react";
import { toast } from "sonner";
import { createSubject, updateSubjectById } from "@/services/subject.service";
import { getAllTeachers } from "@/services/teacher.service";
import { getAllClasses } from "@/services/class.service";

function calcProgress(subject, selectedClasses) {
  const requiredFields = [
    subject?.subjectName,
    subject?.subjectCode,
    subject?.attendee,
  ];
  const completed = requiredFields.filter(
    (f) => f && f.toString().trim()
  ).length;
  const classesSelected = selectedClasses.length > 0 ? 1 : 0;
  const total = requiredFields.length + 1;
  return Math.round(((completed + classesSelected) / total) * 100);
}

export function SubjectForm({
  edit = false,
  subject = null,
  fetchSubjects = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    description: "",
    attendee: "",
  });

  const [selectedClasses, setSelectedClasses] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchTeachersAndClasses();
    }
  }, [isOpen]);

  const fetchTeachersAndClasses = async () => {
    try {
      setLoadingData(true);
      const [teachersData, classesData] = await Promise.all([
        getAllTeachers(),
        getAllClasses(),
      ]);
      setTeachers(teachersData || []);
      setClasses(classesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load teachers and classes");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    if (edit && subject?._id) {
      setFormData((prev) => {
        const newData = {
          subjectName: subject.subjectName || "",
          subjectCode: subject.subjectCode || "",
          description: subject.description || "",
          attendee: subject.attendee?._id || subject.attendee || "",
        };

        if (
          prev.subjectName === newData.subjectName &&
          prev.subjectCode === newData.subjectCode &&
          prev.description === newData.description &&
          prev.attendee === newData.attendee
        ) {
          return prev;
        }

        return newData;
      });

      setSelectedClasses((prev) => {
        const newClasses =
          subject.classes?.map((cls) =>
            typeof cls === "object" ? cls._id : cls
          ) || [];

        const prevSorted = [...prev].sort().join(",");
        const newSorted = [...newClasses].sort().join(",");

        if (prevSorted === newSorted) {
          return prev;
        }

        return newClasses;
      });
    } else if (!edit) {
      setFormData({
        subjectName: "",
        subjectCode: "",
        description: "",
        attendee: "",
      });
      setSelectedClasses([]);
    }
  }, [isOpen, edit, subject?._id]);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Toggle function
  const toggleClass = useCallback((classId) => {
    setSelectedClasses((prev) => {
      if (prev.includes(classId)) {
        return prev.filter((id) => id !== classId);
      }
      return [...prev, classId];
    });
  }, []);

  const selectedTeacher = useMemo(
    () => teachers.find((t) => t._id === formData.attendee),
    [teachers, formData.attendee]
  );

  const handleReset = useCallback(() => {
    setFormData({
      subjectName: "",
      subjectCode: "",
      description: "",
      attendee: "",
    });
    setSelectedClasses([]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subjectName || !formData.subjectCode || !formData.attendee) {
      return toast.error("Please fill in all required fields.");
    }

    if (selectedClasses.length === 0) {
      return toast.error("Please select at least one class.");
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        classes: selectedClasses,
      };
      console.log(payload);

      if (edit) {
        let updatedSubject = await updateSubjectById(subject._id, payload);
        if (updatedSubject) {
          toast.success("Subject updated successfully!");
          fetchSubjects && fetchSubjects();
        }
      } else {
        let createdSubject = await createSubject(payload);
        if (createdSubject) {
          toast.success("Subject created successfully!");
          fetchSubjects && fetchSubjects();
        }
      }
      setIsOpen(false);
      handleReset();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
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
        className="!w-full md:!w-[800px] !max-w-none p-0 border-gray-200 flex flex-col overflow-hidden [&>button]:hidden"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full overflow-hidden"
        >
          <SheetHeader className="px-6 py-4 border-b border-gray-200 bg-red-50 flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
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

            <div>
              <Progress
                value={calcProgress(formData, selectedClasses)}
                className="h-2"
              />
              <div className="flex justify-between text-sm text-gray-700 mt-1">
                <span>Form Completion</span>
                <span>{calcProgress(formData, selectedClasses)}%</span>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 h-full">
            <div className="px-6 py-6">
              {loadingData ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
                </div>
              ) : (
                <>
                  <div className="flex gap-4">
                    <div className="space-y-2 mb-6 flex-1">
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

                    <div className="space-y-2 mb-6 flex-1">
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
                            handleChange(
                              "subjectCode",
                              e.target.value.toUpperCase()
                            )
                          }
                          placeholder="Subject code e.g. MATH101"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 flex gap-4 items-center">
                    <div className="space-y-2">
                      <Label
                        htmlFor="attendee"
                        className="text-gray-700 font-medium"
                      >
                        Subject Teacher <span className="text-red-700">*</span>
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
                            {teachers.length === 0 ? (
                              <div className="p-2 text-sm text-gray-500">
                                No teachers available
                              </div>
                            ) : (
                              teachers.map((teacher) => (
                                <SelectItem
                                  key={teacher._id}
                                  value={teacher._id}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {teacher.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {teacher.email}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {formData.attendee && selectedTeacher && (
                      <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center text-white font-semibold">
                          {selectedTeacher.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {selectedTeacher.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {selectedTeacher.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ✅ FIXED: Classes Selection - Removed duplicate event handlers */}
                  <div className="space-y-2 mb-6">
                    <Label className="text-gray-700 font-medium">
                      Assign to Classes <span className="text-red-700">*</span>
                    </Label>
                    <p className="text-xs text-gray-500 mb-3">
                      Select the classes where this subject will be taught
                    </p>
                    {classes.length === 0 ? (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm text-gray-500">
                        No classes available
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg bg-gray-50">
                        <ScrollArea className="h-52 w-full">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
                            {classes.map((classItem) => {
                              const isSelected = selectedClasses.includes(
                                classItem._id
                              );

                              return (
                                <label
                                  key={classItem._id}
                                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                                    isSelected
                                      ? "bg-red-50 border-red-300"
                                      : "bg-white border-gray-200 hover:bg-gray-100"
                                  }`}
                                >
                                  {/* ✅ CRITICAL FIX: Use label wrapper, single handler */}
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() =>
                                      toggleClass(classItem._id)
                                    }
                                  />
                                  <div className="flex items-center gap-2 flex-1">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                                      {classItem.className?.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">
                                        {classItem.className}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {classItem.students?.length || 0}{" "}
                                        students
                                      </p>
                                    </div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                    {selectedClasses.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-700" />
                        <p className="text-sm text-blue-900">
                          {selectedClasses.length} class(es) selected
                        </p>
                      </div>
                    )}
                  </div>

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
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      rows={4}
                      placeholder="Optional description about the subject"
                    />
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          <SheetFooter className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <Button
              type="submit"
              className="bg-red-700 hover:bg-red-800"
              disabled={
                loading ||
                loadingData ||
                !formData.subjectName.trim() ||
                !formData.subjectCode.trim() ||
                !formData.attendee ||
                selectedClasses.length === 0
              }
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {edit ? "Update Subject" : "Create Subject"}
                </>
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
