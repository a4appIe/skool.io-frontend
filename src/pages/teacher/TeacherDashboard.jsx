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
  BookOpen,
  Users,
  FileText,
  LogOut,
  Bell,
  Settings,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getTeacherProfile } from "@/services/teacher.service";

export default function TeacherDashboard() {
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

  const handleLogout = () => {
    // Clear auth tokens/session
    localStorage.removeItem("teacherToken");
    toast.success("Logged out successfully");
    navigate("/");
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
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Profile Not Found
            </h2>
            <Button
              onClick={() => navigate("/")}
              className="mt-4 bg-red-700 hover:bg-red-800"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center text-white font-semibold">
                {teacher.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{teacher.name}</h2>
                <p className="text-xs text-gray-500">{teacher.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/teacher/settings")}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleLogout}
                size="sm"
                className="bg-red-700 hover:bg-red-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <Card className="bg-gradient-to-r from-red-700 to-red-800 text-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Welcome back, {teacher.name}! 👋
                </h1>
                <p className="text-red-100">
                  Here's what's happening with your classes today
                </p>
              </div>
              {teacher.teacherImage && (
                <div className="w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden">
                  <img
                    src={teacher.teacherImage}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Classes Today</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">94%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pending Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Personal Info Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-red-700" />
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {teacher.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">
                        {teacher.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm font-medium text-gray-900">
                        {teacher.address?.street}, {teacher.address?.city}
                      </p>
                      <p className="text-xs text-gray-600">
                        {teacher.address?.state} - {teacher.address?.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Date of Birth</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(teacher.dob)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Gender</p>
                      <Badge variant="secondary" className="mt-1">
                        {teacher.gender}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Blood Group</p>
                      <Badge variant="secondary" className="mt-1">
                        {teacher.bloodGroup}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-red-700" />
                  Professional Details
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Award className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Qualification</p>
                      <p className="text-sm font-medium text-gray-900">
                        {teacher.qualification}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Experience</p>
                      <p className="text-sm font-medium text-gray-900">
                        {teacher.experience} years
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Joining Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(teacher.joiningDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Aadhar Number</p>
                      <p className="text-sm font-medium text-gray-900">
                        {teacher.aadharNumber}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-2">Status</p>
                    <Badge
                      className={
                        teacher.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {teacher.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            {teacher.documents && teacher.documents.length > 0 && (
              <Card>
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

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-red-700" />
                  Today's Schedule
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      time: "09:00 - 10:00 AM",
                      subject: "Mathematics",
                      class: "Class 10-A",
                      status: "completed",
                    },
                    {
                      time: "10:15 - 11:15 AM",
                      subject: "Physics",
                      class: "Class 10-B",
                      status: "completed",
                    },
                    {
                      time: "11:30 AM - 12:30 PM",
                      subject: "Chemistry",
                      class: "Class 10-A",
                      status: "ongoing",
                    },
                    {
                      time: "01:30 - 02:30 PM",
                      subject: "Mathematics",
                      class: "Class 9-A",
                      status: "upcoming",
                    },
                    {
                      time: "02:45 - 03:45 PM",
                      subject: "Physics",
                      class: "Class 9-B",
                      status: "upcoming",
                    },
                  ].map((schedule, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                        schedule.status === "ongoing"
                          ? "bg-red-50 border-red-200"
                          : schedule.status === "completed"
                          ? "bg-gray-50 border-gray-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            schedule.status === "ongoing"
                              ? "bg-red-100"
                              : schedule.status === "completed"
                              ? "bg-gray-200"
                              : "bg-blue-100"
                          }`}
                        >
                          <Clock
                            className={`h-5 w-5 ${
                              schedule.status === "ongoing"
                                ? "text-red-700"
                                : schedule.status === "completed"
                                ? "text-gray-600"
                                : "text-blue-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {schedule.subject}
                          </p>
                          <p className="text-sm text-gray-600">
                            {schedule.class} • {schedule.time}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          schedule.status === "ongoing"
                            ? "bg-red-700 text-white"
                            : schedule.status === "completed"
                            ? "bg-gray-500 text-white"
                            : "bg-blue-600 text-white"
                        }
                      >
                        {schedule.status === "ongoing"
                          ? "In Progress"
                          : schedule.status === "completed"
                          ? "Completed"
                          : "Upcoming"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-24"
                    onClick={() => navigate("/teacher/attendance")}
                  >
                    <CheckCircle className="h-6 w-6 text-red-700" />
                    <span className="text-sm">Mark Attendance</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-24"
                    onClick={() => navigate("/teacher/students")}
                  >
                    <Users className="h-6 w-6 text-red-700" />
                    <span className="text-sm">View Students</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-24"
                    onClick={() => navigate("/teacher/schedule")}
                  >
                    <Calendar className="h-6 w-6 text-red-700" />
                    <span className="text-sm">View Schedule</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-24"
                    onClick={() => navigate("/teacher/assignments")}
                  >
                    <FileText className="h-6 w-6 text-red-700" />
                    <span className="text-sm">Assignments</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
