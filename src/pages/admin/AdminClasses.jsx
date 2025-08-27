import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Trash2,
  Eye,
  MoreHorizontal,
  Users,
  PersonStanding,
} from "lucide-react";
import { ClassForm } from "@/components/admin/class/ClassForm";
import useClassStore from "@/store/useClassStore";
import { formatDate } from "@/utils/formatDate";
import DeleteModal from "@/components/admin/class/DeleteModal";

// Button handlers can be improved with actual modals/dialogs as needed.
function handleDelete(cls) {
  if (
    window.confirm(
      `Are you sure you want to delete ${cls.className} ${cls._id}?`
    )
  ) {
    alert("Class deleted!");
  }
}
function handleDetails(cls) {
  alert(`View details for ${cls.className} ${cls._id}`);
}

export default function AdminClasses() {
  const classes = useClassStore((state) => state.classes);

  return (
    <div className="bg-gray-50 px-4 py-7 md:px-8">
      <div className="flex md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          All Classes
        </h1>
        <ClassForm edit={false} id={null} />
      </div>

      {/* Responsive grid of class cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {classes.map((cls) => (
          <Card
            key={cls._id}
            className="border-gray-200 group hover:shadow-lg transition-all"
          >
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-red-700 font-semibold flex items-center gap-2">
                <PersonStanding className="h-5 w-5" />
                {cls.className}{" "}
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
                  <DropdownMenuItem onClick={() => handleDetails(cls)}>
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="text-gray-700">Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(cls)}>
                    <Trash2 className="h-4 w-4 mr-2 text-red-700" />
                    <span className="text-red-700">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={
                    cls.status === "Active"
                      ? "border-green-600 text-green-700"
                      : "border-gray-500 text-gray-500"
                  }
                >
                  {cls.status ? "Active" : "Inactive"}
                </Badge>
                <span className="ml-2 text-xs text-gray-500">
                  Created: {formatDate(cls.createdAt)}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <Users className="h-4 w-4 text-gray-400" />
                  Strength:&nbsp;
                  <span className="font-semibold">
                    {cls.studentsCount > 0 ? cls.studentsCount : 0}
                  </span>
                </div>
                <div className="flex flex-col items-start gap-2 text-gray-700 text-sm">
                  <span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                    Incharge: {cls.attendee || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                    CR: {cls.cr || "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 flex gap-2 justify-between">
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:border-red-700 hover:text-red-700"
                onClick={() => handleDetails(cls)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button>
              <div className="flex gap-2">
                <ClassForm edit={true} id={cls._id} />
                <DeleteModal cls={cls} />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
