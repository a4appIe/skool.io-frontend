import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Hash, Loader2, Phone, School, TrendingDown, TrendingUp, User, Users, UserX } from "lucide-react";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Helper function to get attendance color
const getAttendanceColor = (percentage) => {
  if (percentage >= 90) return "bg-green-500 text-white";
  if (percentage >= 80) return "bg-yellow-500 text-white";
  if (percentage >= 75) return "bg-orange-500 text-white";
  return "bg-red-500 text-white";
};

// Helper function to get attendance icon
const getAttendanceIcon = (percentage) => {
  if (percentage >= 90) return <TrendingUp className="h-3 w-3" />;
  if (percentage >= 75) return <TrendingDown className="h-3 w-3" />;
  return <UserX className="h-3 w-3" />;
};

const TableRow = ({
  student,
  onPhoneCall,
  getStudentClass,
  attendanceData,
  state,
}) => {
  const studentAttendance = attendanceData[student._id];
  const attendancePercentage = studentAttendance?.percentage || 0;
  const navigate = useNavigate();

  const handleDetails = (studentId) => {
    navigate(`/school/attendance/student/details/${studentId}`);
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
      {/* Student Info */}
      <td className="py-4 px-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center text-white font-semibold">
            {student.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-base">
              {student.name || "Unknown Name"}
            </div>
            <div className="text-sm text-gray-600 space-y-0.5">
              <div className="flex items-center">
                <Hash className="h-3 w-3 mr-1" />
                {student.username || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </td>

      {/* Gender */}
      <td className="py-4 px-6">
        <Badge
          variant="secondary"
          className={`${
            student.gender === "Male"
              ? "bg-blue-100 text-blue-800"
              : student.gender === "Female"
              ? "bg-pink-100 text-pink-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {student.gender || "N/A"}
        </Badge>
      </td>

      {/* Guardian Phone */}
      <td className="py-4 px-6">
        {student.guardian?.phone ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPhoneCall(student.guardian?.phone)}
            className="text-red-700 hover:text-red-800 hover:bg-red-50 p-2 h-auto"
          >
            <Phone className="h-4 w-4 mr-2" />
            <span className="text-sm">{student.guardian?.phone}</span>
          </Button>
        ) : (
          <span className="text-gray-400 text-sm">Not Available</span>
        )}
      </td>

      {/* Class */}
      <td className="py-4 px-6">
        <Badge variant="outline" className="font-medium">
          {getStudentClass(student)}
        </Badge>
      </td>

      {/* Attendance */}
      <td className="py-4 px-6">
        <div className="text-center space-y-2">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${getAttendanceColor(
              attendancePercentage
            )}`}
          >
            {state.attendanceLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              getAttendanceIcon(attendancePercentage)
            )}
            {state.attendanceLoading
              ? "Loading..."
              : `${Math.round(attendancePercentage)}%`}
          </div>
          <div className="text-xs text-gray-500">
            {state.attendanceLoading
              ? "Fetching..."
              : `${studentAttendance?.presentDays || 0}/${
                  studentAttendance?.totalDays || 0
                } days`}
          </div>
          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div
              className={`h-full transition-all duration-300 ${
                attendancePercentage >= 90
                  ? "bg-green-500"
                  : attendancePercentage >= 80
                  ? "bg-yellow-500"
                  : attendancePercentage >= 75
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${attendancePercentage}%` }}
            ></div>
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="py-4 px-6">
        <Button
          onClick={() => handleDetails(student._id)}
          size="sm"
          className="bg-red-700 hover:bg-red-800 text-white font-medium px-4 py-2"
        >
          <Eye className="h-4 w-4 mr-2" />
          Details
        </Button>
      </td>
    </tr>
  );
};

const StudentCard = ({
  student,
  onViewDetails,
  onPhoneCall,
  getStudentClass,
  attendanceData,
  state,
}) => {
  const studentAttendance = attendanceData[student._id];
  const attendancePercentage = studentAttendance?.percentage || 0;

  return (
    <Card className="p-4 space-y-4 hover:shadow-md transition-shadow border border-gray-200">
      {/* Student Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center text-white font-semibold text-lg">
            {student.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {student.name || "Unknown Name"}
            </h3>
            <p className="text-sm text-gray-600">
              {student.username || "N/A"}
            </p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${getAttendanceColor(
            attendancePercentage
          )}`}
        >
          <div className="flex items-center gap-1">
            {state.attendanceLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              getAttendanceIcon(attendancePercentage)
            )}
            {state.attendanceLoading
              ? "..."
              : `${Math.round(attendancePercentage)}%`}
          </div>
        </div>
      </div>

      {/* Student Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2 text-gray-400" />
            <span>Admission: {student.admissionNumber || "N/A"}</span>
          </div>
          {student.rollNumber && (
            <div className="flex items-center text-sm text-gray-600">
              <School className="h-4 w-4 mr-2 text-gray-400" />
              <span>Roll: {student.rollNumber}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Badge
            variant="secondary"
            className={`inline-flex ${
              student.gender === "Male"
                ? "bg-blue-100 text-blue-800"
                : student.gender === "Female"
                ? "bg-pink-100 text-pink-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {student.gender || "N/A"}
          </Badge>
          <div>
            <Badge variant="outline" className="font-medium">
              {getStudentClass(student)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Attendance Details */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Attendance Record
            </p>
            <p className="text-xs text-gray-500">
              {state.attendanceLoading
                ? "Loading attendance..."
                : `${studentAttendance?.presentDays || 0} present out of ${
                    studentAttendance?.totalDays || 0
                  } days`}
            </p>
          </div>
          <div className="text-right">
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  attendancePercentage >= 90
                    ? "bg-green-500"
                    : attendancePercentage >= 80
                    ? "bg-yellow-500"
                    : attendancePercentage >= 75
                    ? "bg-orange-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${attendancePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        {student.guardian?.phone ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPhoneCall(student.guardian?.phone)}
            className="flex-1 text-red-700 border-red-200 hover:bg-red-50"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Guardian
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            No Phone
          </Button>
        )}
        <Button
          onClick={() => onViewDetails(student._id)}
          size="sm"
          className="flex-1 bg-red-700 hover:bg-red-800 text-white"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </div>
    </Card>
  );
};

const AttendanceStudentsCard = ({
  attendanceData,
  filteredStudents,
  state,
  handleSearchClear,
  getClassName,
}) => {
  const navigate = useNavigate();
  const handleViewDetails = useCallback(
    (studentId) => {
      console.log(`📋 Viewing attendance details for student: ${studentId}`);
      navigate(`/admin/attendance/details/${studentId}`);
    },
    [navigate]
  );

  const handlePhoneCall = useCallback((phoneNumber) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      toast.error("Phone number not available");
    }
  }, []);

  const getStudentClass = useCallback(
    (student) => {
      if (student.studentClass) {
        return typeof student.studentClass === "object"
          ? student.studentClass.className
          : getClassName(student.studentClass);
      }
      return "No Class";
    },
    [getClassName]
  );
  return (
    <Card className="shadow-lg border-0 p-0">
      <CardContent className="p-0">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Students Found
            </h3>
            <p className="text-gray-600">
              {state.searchQuery.trim()
                ? "No students match your search criteria."
                : state.selectedClass === "all"
                ? "Please select a class to view students and their attendance."
                : `No students found in ${getClassName(state.selectedClass)}.`}
            </p>
            {state.searchQuery.trim() && (
              <Button
                variant="outline"
                onClick={handleSearchClear}
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View (hidden on mobile) */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                        Student Information
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                        Gender
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                        Guardian Phone
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                        Class
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                        Attendance
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.map((student) => (
                      <TableRow
                        key={student._id}
                        student={student}
                        onViewDetails={handleViewDetails}
                        onPhoneCall={handlePhoneCall}
                        getStudentClass={getStudentClass}
                        attendanceData={attendanceData}
                        state={state}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View (hidden on desktop) */}
            <div className="lg:hidden p-4 space-y-4">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student._id}
                  student={student}
                  onViewDetails={handleViewDetails}
                  onPhoneCall={handlePhoneCall}
                  getStudentClass={getStudentClass}
                  attendanceData={attendanceData}
                  state={state}
                />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceStudentsCard;
