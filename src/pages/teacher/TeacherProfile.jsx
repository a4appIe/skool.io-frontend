import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  FileText,
  ArrowLeft,
  Edit,
  Shield,
  Droplet,
  Users,
  BookOpen,
  ClipboardList,
  DollarSign,
  Clock,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getTeacherProfile } from "@/services/teacher.service";

export default function TeacherProfile() {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const data = await getTeacherProfile();
      setTeacher(data);
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Profile Not Found
            </h2>
            <Button
              onClick={() => navigate(-1)}
              className="mt-4 bg-red-700 hover:bg-red-800"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm rounded-xl">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between py-8 flex-col md:flex-row gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="mr-2 bg-red-700 rounded-md hover:bg-red-800 text-white hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Teacher Profile
                  </h1>
                  <p className="text-xs text-gray-500">
                    View and manage your profile information
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => toast.info("Feature coming soon")}
                  className="bg-red-700 hover:bg-red-800 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Picture Card */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="text-center">
                  {teacher.teacherImage ? (
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-red-100 shadow-lg">
                      <img
                        src={teacher.teacherImage}
                        alt={teacher.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center text-white font-bold text-4xl">
                      {teacher.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {teacher.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">
                    {teacher.username}
                  </p>
                  <Badge
                    className={
                      teacher.status === "Active"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    {teacher.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info Card */}
            <Card className="shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-red-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Teacher ID</p>
                    <p className="font-semibold text-gray-900">
                      {teacher.teacherId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <Award className="h-5 w-5 text-red-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="font-semibold text-gray-900">
                      {teacher.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-red-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Joining Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(teacher.joiningDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-red-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Salary</p>
                    <p className="font-semibold text-gray-900">
                      ₹{teacher.salary?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="shadow-sm">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Additional Information
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Gender</p>
                    <Badge variant="secondary" className="mt-1">
                      {teacher.gender}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Blood Group</p>
                    <Badge variant="secondary" className="mt-1 flex items-center gap-1 w-fit">
                      <Droplet className="h-3 w-3" />
                      {teacher.bloodGroup}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <Badge variant="secondary">{teacher.category}</Badge>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Experience</p>
                  <p className="text-sm font-medium text-gray-900">
                    {teacher.experience} years
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            {teacher.documents && teacher.documents.length > 0 && (
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-700" />
                    Documents
                  </h3>
                  <div className="space-y-2">
                    {teacher.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {doc.name}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(doc.file, "_blank")}
                          className="text-red-700 hover:text-red-800"
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-red-700" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <a
                          href={`mailto:${teacher.email}`}
                          className="text-sm font-medium text-red-700 hover:text-red-800 break-all"
                        >
                          {teacher.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <a
                          href={`tel:${teacher.phone}`}
                          className="text-sm font-medium text-red-700 hover:text-red-800"
                        >
                          {teacher.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Address</p>
                        <p className="text-sm font-medium text-gray-900">
                          {teacher.address?.street}
                        </p>
                        <p className="text-sm text-gray-700">
                          {teacher.address?.city}, {teacher.address?.state}
                        </p>
                        <p className="text-xs text-gray-600">
                          {teacher.address?.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-red-700" />
                  Professional Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Award className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Qualification
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {teacher.qualification}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Briefcase className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Experience</p>
                        <p className="text-sm font-medium text-gray-900">
                          {teacher.experience} years
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Date of Birth
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(teacher.dob)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Aadhar Number
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {teacher.aadharNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-24 border-red-200 hover:bg-red-50"
                    onClick={() => navigate("/teacher/students")}
                  >
                    <Users className="h-6 w-6 text-red-700" />
                    <span className="text-sm">My Students</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-24 border-red-200 hover:bg-red-50"
                    onClick={() => navigate("/teacher/attendance")}
                  >
                    <ClipboardList className="h-6 w-6 text-red-700" />
                    <span className="text-sm">Attendance</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-24 border-red-200 hover:bg-red-50"
                    onClick={() => navigate("/teacher/schedule")}
                  >
                    <Clock className="h-6 w-6 text-red-700" />
                    <span className="text-sm">Schedule</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-24 border-red-200 hover:bg-red-50"
                    onClick={() => navigate("/teacher/assignments")}
                  >
                    <BookOpen className="h-6 w-6 text-red-700" />
                    <span className="text-sm">Assignments</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-24 border-red-200 hover:bg-red-50"
                    onClick={() => navigate("/teacher/notices")}
                  >
                    <Bell className="h-6 w-6 text-red-700" />
                    <span className="text-sm">Notices</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-24 border-red-200 hover:bg-red-50"
                    onClick={() => navigate("/teacher/payroll")}
                  >
                    <DollarSign className="h-6 w-6 text-red-700" />
                    <span className="text-sm">Payroll</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-24 border-red-200 hover:bg-red-50"
                    onClick={() => navigate("/teacher/classes")}
                  >
                    <BookOpen className="h-6 w-6 text-red-700" />
                    <span className="text-sm">Classes</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-24 border-red-200 hover:bg-red-50"
                    onClick={() => navigate("/teacher/settings")}
                  >
                    <User className="h-6 w-6 text-red-700" />
                    <span className="text-sm">Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card className="shadow-sm bg-gray-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  System Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">School ID</p>
                    <p className="font-medium text-gray-900">
                      {teacher.schoolId}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Created At</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(teacher.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Last Updated</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(teacher.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
