import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, GraduationCap, Edit, ArrowLeft } from "lucide-react";
import useTeacherStore from "@/store/useTeacherStore";
import { getTeacher } from "@/services/teacher.service";
import TeacherInfoCard from "@/components/admin/teachers/teacher-profile/TeacherInfoCard";
import TeacherTabsSection from "@/components/admin/teachers/teacher-profile/TeacherTabsSection";

export function AdminTeacherProfile() {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const getTeacherById = useTeacherStore((state) => state.getTeacherById);
  const navigate = useNavigate();

  // Fetch teacher data
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        let teacher = await getTeacher(teacherId);
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
    window.open(`/uploads/teachers/${document.file}`, "_blank");
  };

  const handleDownloadDocument = (document) => {
    const link = document.createElement("a");
    link.href = `/uploads/teachers/${document.file}`;
    link.download = document.file;
    link.click();
  };

  const handleEditTeacher = () => {
    navigate(`/school/hr/edit-teacher/${teacher?._id}`);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm rounded-xl">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between py-8 flex-col md:flex-row gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={goBack}
                  className="mr-2 bg-red-700 rounded-md hover:bg-red-800 text-white hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Teacher Profile
                  </h1>
                  <p className="text-xs text-gray-500">{teacher.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleEditTeacher}
                  className="bg-red-700 hover:bg-red-700 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Teacher Info Card */}
        <TeacherInfoCard teacher={teacher} />

        {/* Tabs Section */}
        <TeacherTabsSection
          teacher={teacher}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleCall={handleCall}
          handleEmail={handleEmail}
          handleViewDocument={handleViewDocument}
          handleDownloadDocument={handleDownloadDocument}
        />
      </div>
    </div>
  );
}
