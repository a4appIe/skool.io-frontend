import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
  GraduationCap,
  FileText,
  Download,
  Eye,
  Edit,
  ArrowLeft,
  Globe,
  PhoneCall,
  Send,
  ExternalLink,
  Award,
  Clock,
  Star,
  BookOpen,
  Users,
} from "lucide-react";
import useTeacherStore from "@/store/useTeacherStore";
import { getTeacher } from "@/services/teacher.service";

export function AdminTeacherProfile() {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const getTeacherById = useTeacherStore((state) => state.getTeacherById);
  const TEACHER_PATH = import.meta.env.VITE_TEACHER_PATH;
  const navigate = useNavigate();

  // Fetch teacher data
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        let teacher = await getTeacherById(teacherId);
        if (!teacher) {
          teacher = await getTeacher(teacherId);
        }
        setTeacher(teacher);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchTeacherData();
    }
  }, [teacherId, getTeacherById]);

  // Action handlers
  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, "_self");
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`, "_self");
  };

  const handleViewDocument = (document) => {
    // Replace with your document viewing logic
    window.open(`/uploads/teachers/${document.file}`, "_blank");
  };

  const handleDownloadDocument = (document) => {
    // Replace with your download logic
    const link = document.createElement("a");
    link.href = `/uploads/teachers/${document.file}`;
    link.download = document.file;
    link.click();
  };

  const handleEditTeacher = () => {
    navigate(`/school/hr/edit-teacher/${teacher.teacherId}`);
  };

  const goBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teacher profile...</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Teacher not found
          </h3>
          <p className="text-gray-500 mb-6">
            The requested teacher profile could not be found.
          </p>
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={goBack} className="mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <GraduationCap className="h-6 w-6 text-red-700" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Teacher Profile
                </h1>
                <p className="text-sm text-gray-500">{teacher.name}</p>
              </div>
            </div>
            <Button
              onClick={handleEditTeacher}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Teacher Info Card */}
        <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-red-600 to-red-700 overflow-hidden">
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
              {/* Teacher Image */}
              <div className="lg:col-span-1 flex justify-center lg:justify-start">
                <div className="relative">
                  <img
                    src={
                      teacher.teacherImage
                        ? `${TEACHER_PATH}/${teacher.teacherImage}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            teacher.name
                          )}&background=ef4444&color=fff&size=200`
                    }
                    alt={teacher.name}
                    className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        teacher.name
                      )}&background=ef4444&color=fff&size=200`;
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md">
                    <Badge
                      className={`text-xs font-medium ${
                        teacher.status === "Active"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      {teacher.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="lg:col-span-3 text-white">
                <h2 className="text-3xl font-bold mb-2">{teacher.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <div className="space-y-2 bg-red-50 border border-black w-fit px-5 py-2 rounded-lg text-red-700">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span className="">
                          {teacher.designation || "Teacher"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>
                          {teacher.department || "Academic Department"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        <span>ID: {teacher.teacherId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{teacher.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span className="text-sm">{teacher.qualification}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {teacher.experience} years experience
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">
                        {teacher.address.city}, {teacher.address.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        Joined:{" "}
                        {new Date(teacher.joiningDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {teacher.performanceMetrics?.studentsCount || 0}{" "}
                        students
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span className="text-sm">
                        {teacher.performanceMetrics?.subjectsTeaching || 0}{" "}
                        subjects
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs Section */}
        <Card className="shadow-lg border bg-red-50 border-red-200">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-gray-200 bg-gray-50">
              <TabsList className="grid w-full grid-cols-4 h-auto p-0 bg-white rounded-none">
                <TabsTrigger
                  value="personal"
                  className="data-[state=active]:border-b-2 data-[state=active]:bg-red-700 data-[state=active]:text-gray-50 py-4 px-6 rounded-none"
                >
                  <User className="h-4 w-4 mr-2" />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger
                  value="professional"
                  className="data-[state=active]:border-b-2 data-[state=active]:bg-red-700 data-[state=active]:text-gray-50 py-4 px-6 rounded-none"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Professional
                </TabsTrigger>
                <TabsTrigger
                  value="address"
                  className="data-[state=active]:border-b-2 data-[state=active]:bg-red-700 data-[state=active]:text-gray-50 py-4 px-6 rounded-none"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Address
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:border-b-2 data-[state=active]:bg-red-700 data-[state=active]:text-gray-50 py-4 px-6 rounded-none"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4 bg-red-100 p-6 rounded-lg border border-red-500">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-red-700" />
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Full Name:</span>
                      <span className="font-medium">{teacher.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Username:</span>
                      <span className="font-medium">{teacher.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{teacher.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="font-medium">
                        {new Date(teacher.dob).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blood Group:</span>
                      <span className="font-medium">{teacher.bloodGroup}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-red-100 p-6 rounded-lg border border-red-500">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-red-700" />
                    Identity Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{teacher.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Aadhar Number:</span>
                      <span className="font-medium font-mono">
                        {teacher.aadharNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-red-100 p-6 rounded-lg border border-red-500">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-red-700" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {teacher.email}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEmail(teacher.email)}
                          className="h-8 w-8 p-0 border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{teacher.phone}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCall(teacher.phone)}
                          className="h-8 w-8 p-0 border-green-500 text-green-600 hover:bg-green-50"
                        >
                          <PhoneCall className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Professional Info Tab */}
            <TabsContent value="professional" className="p-6">
              <div className="space-y-8">
                {/* Qualifications & Experience */}
                <div className="bg-blue-100 border border-blue-500 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education & Experience
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Qualification:</span>
                        <span className="font-medium text-right">
                          {teacher.qualification}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">
                          {teacher.experience} years
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Joining Date:</span>
                        <span className="font-medium">
                          {new Date(teacher.joiningDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">
                          {teacher.department}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Designation:</span>
                        <span className="font-medium">
                          {teacher.designation}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Working Hours:</span>
                        <span className="font-medium">
                          {teacher.workingHours}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
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
                  </div>
                </div>

                {/* Subjects & Classes */}
                {teacher.subjects && teacher.subjects.length > 0 && (
                  <div className="bg-purple-100 border border-purple-500 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Subjects & Classes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Subjects Teaching:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {teacher.subjects.map((subject, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-purple-100 text-purple-800 border-purple-300"
                            >
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Classes Handling:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {teacher.classes.map((className, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-blue-100 text-blue-800 border-blue-300"
                            >
                              {className}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Metrics */}
                {teacher.performanceMetrics && (
                  <div className="bg-green-100 border border-green-500 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Performance Overview
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-700">
                          {teacher.performanceMetrics.studentsCount}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Students
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700">
                          {teacher.performanceMetrics.subjectsTeaching}
                        </div>
                        <div className="text-sm text-gray-600">Subjects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-700">
                          {teacher.performanceMetrics.classesHandling}
                        </div>
                        <div className="text-sm text-gray-600">Classes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-700">
                          {teacher.performanceMetrics.yearsOfService}
                        </div>
                        <div className="text-sm text-gray-600">
                          Years Service
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address" className="p-6">
              <div className="bg-red-100 border border-red-500 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-700" />
                  Residential Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Street Address:</span>
                      <span className="font-medium text-right">
                        {teacher.address.street}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">City:</span>
                      <span className="font-medium">
                        {teacher.address.city}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">State:</span>
                      <span className="font-medium">
                        {teacher.address.state}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pincode:</span>
                      <span className="font-medium font-mono">
                        {teacher.address.pincode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Full Address Display */}
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Complete Address
                      </h4>
                      <p className="text-gray-700">
                        {teacher.address.street}, {teacher.address.city},{" "}
                        {teacher.address.state} - {teacher.address.pincode}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() =>
                          window.open(
                            `https://maps.google.com?q=${encodeURIComponent(
                              `${teacher.address.street}, ${teacher.address.city}, ${teacher.address.state} ${teacher.address.pincode}`
                            )}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Map
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-700" />
                    Teacher Documents ({teacher.documents.length})
                  </h3>
                </div>

                {teacher.documents.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No documents uploaded
                    </h3>
                    <p className="text-gray-500">
                      No documents have been uploaded for this teacher yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teacher.documents.map((document, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-md transition-shadow bg-red-100 border-red-500"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-red-700" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">
                                {document.name}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Uploaded:{" "}
                                {new Date(
                                  document.uploadDate
                                ).toLocaleDateString()}
                              </p>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewDocument(document)}
                                  className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleDownloadDocument(document)
                                  }
                                  className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
