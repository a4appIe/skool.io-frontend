import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  User,
  Users,
  GraduationCap,
  Calendar,
  Info,
  Mail,
  Phone,
  Building2,
  ClipboardList,
  Eye,
  X,
} from "lucide-react";

export function SubjectInfoModal({ subject }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl sm:min-w-3xl  max-h-[90vh] overflow-y-auto [&>button]:hidden p-0">
        {/* Header Section - Fixed */}
        <DialogHeader className="px-6 py-5 bg-gradient-to-r from-red-50 to-orange-50 border-b">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-3 items-center">
              <div className="p-3 bg-gradient-to-br from-red-700 to-red-800 rounded-xl shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="sm:flex-1">
                <DialogTitle className="text-2xl font-bold text-gray-900 mb-1">
                  {subject?.subjectName || "Subject Details"}
                </DialogTitle>
              </div>
            </div>

            <div className="flex gap-3">
              <Badge
                variant="outline"
                className="font-mono text-sm px-3 py-1 bg-white border-red-300 text-red-700 hidden sm:inline"
              >
                {subject?.subjectCode || "N/A"}
              </Badge>
              <div
                className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 max-h-[calc(90vh-140px)]">
          <div className="px-6 py-6 space-y-6">
            {/* Quick Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 font-medium">
                      Total Classes
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {subject?.classes?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-700 font-medium">
                      Status
                    </p>
                    <p className="text-lg font-bold text-purple-900">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 bg-red-700 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-900">
                  Subject Information
                </h3>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
                {/* Subject Name */}
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                      Subject Name
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      {subject?.subjectName || "N/A"}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Subject Code */}
                <div className="flex items-start gap-3">
                  <ClipboardList className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                      Subject Code
                    </p>
                    <p className="text-base font-mono font-medium text-gray-900">
                      {subject?.subjectCode || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {subject?.description && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">
                          Description
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {subject.description}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Teacher Information Section */}
            {subject?.attendee && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 bg-red-700 rounded-full"></div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Assigned Teacher
                  </h3>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    {/* Teacher Avatar */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
                      {subject.attendee.name?.charAt(0)?.toUpperCase() || "T"}
                    </div>

                    {/* Teacher Details */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {subject.attendee.name || "N/A"}
                        </p>
                        <Badge
                          variant="secondary"
                          className="mt-1 outline outline-blue-700 bg-blue-50 text-blue-700"
                        >
                          Subject Teacher
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {/* Email */}
                        {subject.attendee.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <a
                              href={`mailto:${subject.attendee.email}`}
                              className="text-gray-700 hover:text-red-700 transition-colors"
                            >
                              {subject.attendee.email}
                            </a>
                          </div>
                        )}

                        {/* Phone */}
                        {subject.attendee.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <a
                              href={`tel:${subject.attendee.phone}`}
                              className="text-gray-700 hover:text-red-700 transition-colors"
                            >
                              {subject.attendee.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Assigned Classes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 bg-red-700 rounded-full"></div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Assigned Classes
                  </h3>
                </div>
                <Badge
                  variant="outline"
                  className="bg-blue-50 border-blue-200 text-blue-700"
                >
                  {subject?.classes?.length || 0} Classes
                </Badge>
              </div>

              {subject?.classes && subject.classes.length > 0 ? (
                <div className="space-y-3">
                  {subject.classes.map((classItem, index) => (
                    <div
                      key={classItem._id || index}
                      className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-red-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        {/* Class Number Badge */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                          {classItem.className?.charAt(0)?.toUpperCase() ||
                            index + 1}
                        </div>

                        {/* Class Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">
                              {classItem.className || `Class ${index + 1}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-600">
                    No classes assigned
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    This subject has not been assigned to any classes yet
                  </p>
                </div>
              )}
            </div>

            {/* Summary Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    Summary
                  </p>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    This subject is currently assigned to{" "}
                    <span className="font-bold">
                      {subject?.classes?.length || 0} class
                      {subject?.classes?.length !== 1 ? "es" : ""}
                    </span>
                    {". "}
                    {subject?.attendee && (
                      <>
                        {" "}
                        The subject is taught by{" "}
                        <span className="font-bold">
                          {subject.attendee.name}
                        </span>
                        .
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
