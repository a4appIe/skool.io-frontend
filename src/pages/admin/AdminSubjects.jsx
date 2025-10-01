import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Book } from "lucide-react";
import { SubjectForm } from "@/components/admin/subjects/SubjectForm";
import DeleteModal from "@/components/admin/subjects/DeleteModal";
import { formatDate } from "@/utils/formatDate";
import { getAllSubjects } from "@/services/subject.service";
import { useEffect, useState } from "react";

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

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

  if (loading) return <h1>LOADING...</h1>;

  return (
    <div className="bg-gray-50 px-4 py-7 md:px-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          All Subjects
        </h1>
        <SubjectForm edit={false} fetchSubjects={fetchSubjects} />
      </div>

      {subjects.length === 0 && (
        <div className="text-center text-gray-500">
          No subjects found. Please add a subject.
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {subjects.map((subject) => (
          <Card
            key={subject._id}
            className="border-gray-200 group hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-red-700 flex items-center gap-2">
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
                <SubjectForm
                  edit={true}
                  subject={subject}
                  fetchSubjects={fetchSubjects}
                />
                <DeleteModal subject={subject} fetchSubjects={fetchSubjects} />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
