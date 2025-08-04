import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Trash2, Eye, MoreHorizontal, Book, Users } from "lucide-react";
import { SubjectForm } from "@/components/admin/subjects/SubjectForm";
import DeleteModal from "@/components/admin/subjects/DeleteModal";
import useSubjectStore from "@/store/useSubjectStore";
import { formatDate } from "@/utils/formatDate";

// Placeholder handlers for your Details and Delete logic
function handleDelete(subject) {
  if (
    window.confirm(
      `Are you sure you want to delete subject: ${subject.subjectName}?`
    )
  ) {
    alert("Subject deleted!");
  }
}
function handleDetails(subject) {
  alert(
    `Details for subject: ${subject.subjectName}\n\n${subject.description}`
  );
}

export default function AdminSubjects() {
  const subjects = useSubjectStore((state) => state.subjects);

  return (
    <div className="bg-gray-50 px-4 py-7 md:px-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          All Subjects
        </h1>
        <SubjectForm />
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
            className="border-gray-200 group hover:shadow-lg transition-all"
          >
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-red-700 flex items-center gap-2">
                <Book className="h-5 w-5" />
                {subject.subjectName}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100 text-xl text-gray-500 focus:outline-none group"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={2}
                  className="w-36"
                >
                  <DropdownMenuItem onClick={() => handleDetails(subject)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(subject)}>
                    <Trash2 className="h-4 w-4 mr-2 text-red-700" />
                    <span className="text-red-700">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:border-red-700 hover:text-red-700"
                onClick={() => handleDetails(subject)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button>
              <div className="flex gap-2">
                <SubjectForm edit={true} subject={subject} />
                <DeleteModal subject={subject} />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
