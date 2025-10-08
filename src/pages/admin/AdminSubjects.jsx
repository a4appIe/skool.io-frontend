import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, ArrowLeft } from "lucide-react";
import { SubjectForm } from "@/components/admin/subjects/SubjectForm";
import DeleteModal from "@/components/admin/subjects/DeleteModal";
import { formatDate } from "@/utils/formatDate";
import { getAllSubjects } from "@/services/subject.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubjectInfoModal } from "@/components/admin/subjects/SubjectInfoModal";

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // API CALL
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const subjects = await getAllSubjects();
      setSubjects(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
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
                    All Subjects
                  </h1>
                  <p className="text-xs text-gray-500">
                    Manage and view all subjects
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1">
                  {subjects.length} Total Subjects
                </Badge>
                <SubjectForm edit={false} fetchSubjects={fetchSubjects} />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {subjects.length === 0 ? (
          <div className="text-center py-16">
            <Book className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No subjects found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first subject
            </p>
            <SubjectForm edit={false} fetchSubjects={fetchSubjects} />
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subjects.map((subject) => (
              <Card
                key={subject._id}
                className="border-gray-200 group hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <CardHeader className="flex items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold text-red-800 flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    {subject.subjectName}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {subject.description}
                  </p>
                  <div className="space-y-2 mt-2">
                    <div className="flex flex-col items-start gap-2 text-gray-700 text-sm">
                      <span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                        Code: {subject.subjectCode || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                        Created: {formatDate(subject?.createdAt) || "N/A"}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 flex gap-2 justify-between">
                  <div className="flex gap-2">
                    <SubjectInfoModal subject={subject} />
                    <SubjectForm
                      edit={true}
                      subject={subject}
                      fetchSubjects={fetchSubjects}
                    />
                    <DeleteModal
                      subject={subject}
                      fetchSubjects={fetchSubjects}
                    />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
