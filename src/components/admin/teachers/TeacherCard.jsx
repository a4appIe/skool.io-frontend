import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  MapPin,
  MoreVertical,
  GraduationCap,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteModal from "./DeleteModal";

const TeacherCard = ({ teacher }) => {
  const TEACHER_PATH = import.meta.env.VITE_TEACHER_PATH;
  const navigate = useNavigate();

  const handleEditNavigate = () => {
    navigate(`/school/hr/edit-teacher/${teacher.teacherId}`);
  };

  const handleProfileNavigate = () => {
    navigate(`/school/teachers/profile/${teacher.teacherId}`);
  };

  return (
    <div>
      <Card
        key={teacher._id}
        className="group hover:shadow-xl transition-all duration-300 border-red-500 bg-gradient-to-br from-red-50 to-red-100 overflow-hidden"
      >
        {/* Teacher Image & Status */}
        <div className="relative p-6 pb-4">

          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <img
                src={
                  teacher.teacherImage &&
                  `${TEACHER_PATH}/${teacher.teacherImage}`
                }
                alt={teacher.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    teacher.name
                  )}&background=ef4444&color=fff&size=150`;
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-3 h-3 text-white" />
              </div>
            </div>

            <h3 className="font-bold text-lg text-gray-900 text-center mb-1">
              {teacher.name || "N/A"}
            </h3>
            <Badge
              variant="outline"
              className="text-xs bg-white border-red-200 text-red-700"
            >
              {teacher.status}
            </Badge>
          </div>
        </div>

        {/* Teacher Details */}
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Hash className="h-3 w-3 text-gray-400" />
              {/* <span className="text-gray-600">Adm:</span> */}
              <span className="font-medium text-gray-900 truncate">
                {teacher.username}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className="text-gray-900 truncate font-medium">
                {teacher.email || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className="text-gray-900 font-medium">
                {teacher.phone || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className="text-gray-600 truncate">
                {teacher.address.city || "N/A"},{" "}
                {teacher.address.state || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className="text-gray-600">
                DOB: {new Date(teacher.dob || "N/A").toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Guardian Info
          <div className="bg-gray-50 rounded-lg p-3 mt-3">
            <div className="text-xs text-gray-600 mb-1">Guardian</div>
            <div className="font-medium text-sm text-gray-900">
              {teacher.guardian.name || "N/A"}
            </div>
            <div className="text-xs text-gray-600">
              {teacher.guardian.relation || "N/A"} • {teacher.guardian.phone || "N/A"}
            </div>
          </div> */}
        </CardContent>

        {/* Action Buttons */}
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex gap-2 flex-1">
            <Button
              size="sm"
              variant="outline"
              onClick={handleProfileNavigate
              }
              className="flex-1 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleEditNavigate}
              className="flex-1 border-gray-200 text-gray-700 hover:border-green-500 hover:text-green-700 hover:bg-green-50"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="ml-2 h-8 w-8 p-0 text-gray-500 hover:text-red-700 hover:bg-red-50"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={handleProfileNavigate}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditNavigate}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Teacher
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                onClick={() => handleDeleteStudent(student._id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem> */}
              <DeleteModal teacher={teacher} />
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TeacherCard;
