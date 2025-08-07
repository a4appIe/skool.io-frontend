import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Users, FileText, Edit, ArrowLeft } from "lucide-react";
import BasicInfo from "@/components/admin/students/student-profile/BasicInfo";
import PersonalInfo from "@/components/admin/students/student-profile/PersonalInfo";
import FamilyInfo from "@/components/admin/students/student-profile/FamilyInfo";
import AddressInfo from "@/components/admin/students/student-profile/AddressInfo";
import DocumentsInfo from "@/components/admin/students/student-profile/DocumentsInfo";
import { getStudent } from "@/services/student.service";
import useStudentStore from "@/store/useStudentStore";

export function AdminStudentProfile() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const getStudentById = useStudentStore((state) => state.getStudentById);
  const navigate = useNavigate();

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        let student = await getStudentById(studentId);
        if (!student) {
          student = await getStudent(studentId);
        }
        setStudent(student);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId, getStudentById]);

  const handleEditStudent = () => {
    navigate(`/school/front-desk/edit-student/${student.studentId}`);
  };

  const goBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Student not found
          </h3>
          <p className="text-gray-500 mb-6">
            The requested student profile could not be found.
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
              <User className="h-6 w-6 text-red-700" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Student Profile
                </h1>
                <p className="text-sm text-gray-500">{student.name}</p>
              </div>
            </div>
            <Button
              onClick={handleEditStudent}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Student Info Card */}
        <BasicInfo student={student} />

        {/* Tabs Section */}
        <Card className="shadow-lg border bg-red-50 border-red-200">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* TAB TRIGGERS */}
            <div className="border-b border-gray-200">
              <TabsList className="grid w-full grid-cols-4 h-auto p-0 bg-white rounded-none">
                <TabsTrigger
                  value="personal"
                  className="data-[state=active]:border-b-2 data-[state=active]:bg-red-700 data-[state=active]:text-gray-50 py-4 px-6 rounded-none"
                >
                  <User className="h-4 w-4 mr-2" />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger
                  value="family"
                  className="data-[state=active]:border-b-2 data-[state=active]:bg-red-700 data-[state=active]:text-gray-50 py-4 px-6 rounded-none"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Family Info
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
            <PersonalInfo student={student} />

            {/* Family Info Tab */}
            <FamilyInfo student={student} />

            {/* Address Tab */}
            <AddressInfo student={student} />

            {/* Documents Tab */}
            <DocumentsInfo student={student} />
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
