/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  User,
  BookOpen,
  Calendar,
  Hash,
  X,
  UserCheck,
  School,
  Eye,
} from "lucide-react";
import { getClass } from "@/services/class.service";

// Mock Data
// const mockClassData = {
//   _id: "class123",
//   className: "Class 10-A",
//   classTeacher: {
//     name: "Sahil Rathi",
//     username: "TR202563861",
//     _id: "teacher123",
//   },
//   students: [
//     {
//       _id: "student1",
//       name: "Rahul Sharma",
//       rollNumber: "101",
//       status: "Active",
//     },
//     {
//       _id: "student2",
//       name: "Priya Verma",
//       rollNumber: "102",
//       status: "Active",
//     },
//     {
//       _id: "student3",
//       name: "Amit Kumar",
//       rollNumber: "103",
//       status: "Active",
//     },
//     {
//       _id: "student4",
//       name: "Neha Singh",
//       rollNumber: "104",
//       status: "Active",
//     },
//     {
//       _id: "student5",
//       name: "Rohan Gupta",
//       rollNumber: "105",
//       status: "Active",
//     },
//     {
//       _id: "student6",
//       name: "Anjali Reddy",
//       rollNumber: "106",
//       status: "Active",
//     },
//     {
//       _id: "student7",
//       name: "Karan Mehta",
//       rollNumber: "107",
//       status: "Active",
//     },
//     {
//       _id: "student8",
//       name: "Pooja Patel",
//       rollNumber: "108",
//       status: "Active",
//     },
//     {
//       _id: "student9",
//       name: "Vikram Joshi",
//       rollNumber: "109",
//       status: "Active",
//     },
//     {
//       _id: "student10",
//       name: "Sneha Desai",
//       rollNumber: "110",
//       status: "Active",
//     },
//   ],
//   subjects: [
//     { subjectName: "Mathematics", subjectCode: "MATH101" },
//     { subjectName: "Physics", subjectCode: "PHY101" },
//     { subjectName: "Chemistry", subjectCode: "CHEM101" },
//     { subjectName: "Biology", subjectCode: "BIO101" },
//     { subjectName: "English", subjectCode: "ENG101" },
//     { subjectName: "Hindi", subjectCode: "HIN101" },
//     { subjectName: "Social Science", subjectCode: "SOC101" },
//     { subjectName: "Computer Science", subjectCode: "CS101" },
//   ],
//   createdAt: "2024-04-15T10:30:00.000Z",
//   updatedAt: "2025-10-01T14:20:00.000Z",
// };

export default function ClassInfoModal({
  classData,
}) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Fetch Class Data
  async function fetchClassDetails() {
    if (open) {
      let cls = await getClass(classData?._id);
      console.log(cls);
      if (cls) {
        setData(cls);
      }
    }
  }

  useEffect(() => {
    fetchClassDetails();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl sm:min-w-3xl  max-h-[90vh] overflow-y-auto [&>button]:hidden p-0">
        {/* Header */}
        <DialogHeader
          className={
            "px-6 py-5 bg-gradient-to-r from-red-50 to-orange-50 border-b"
          }
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center text-white font-bold">
                {data?.className?.charAt(0)}
              </div>
              <div>
                <span>{data?.className}</span>
                <p className="text-sm font-normal text-gray-500 mt-1">
                  Class Information
                </p>
              </div>
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-6 mt-4 px-4 pb-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {data?.students || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 mb-1">Class Teacher</p>
                  <p className="text-lg font-bold text-green-900 truncate">
                    {data?.attendee?.name || "Not Assigned"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 mb-1">Subjects</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {data?.subjects || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Class Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <School className="h-5 w-5 text-red-700" />
              Class Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Hash className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Class Name</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {data?.className}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Class Teacher</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {data?.attendee?.name || "Not Assigned"}
                    </p>
                    {data?.attendee?.username && (
                      <p className="text-xs text-gray-600">
                        {data?.attendee?.username}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Students</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {data?.students || 0} students enrolled
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Subjects</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {data?.subjects || 0} subjects
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Created On</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(data?.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(data?.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
