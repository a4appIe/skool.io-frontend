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
  Trash2,
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

const StudentCard = ({ student }) => {
  const STUDENT_PATH = import.meta.env.VITE_STUDENT_PATH;
  const navigate = useNavigate();

  return (
    <div>
      <Card
        key={student._id}
        className="group hover:shadow-xl transition-all duration-300 border-gray-200 bg-white overflow-hidden"
      >
        {/* Student Image & Status */}
        <div className="relative bg-gradient-to-br from-red-50 to-red-100 p-6 pb-4">
          <div className="absolute top-1 right-1">
            <Badge
              variant={"outlined"}
              className={
                "text-xs font-medium bg-green-100 text-green-800 border-green-200"
              }
            >
              {"RN: " + (student.rollNumber || 0)}
            </Badge>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <img
                src={
                  student.studentImage &&
                  `${STUDENT_PATH}/${student.studentImage}`
                }
                alt={student.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    student.name
                  )}&background=ef4444&color=fff&size=150`;
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-3 h-3 text-white" />
              </div>
            </div>

            <h3 className="font-bold text-lg text-gray-900 text-center mb-1">
              {student.name}
            </h3>
            <Badge
              variant="outline"
              className="text-xs bg-white border-red-200 text-red-700"
            >
              {student.studentClass?.className}
            </Badge>
          </div>
        </div>

        {/* Student Details */}
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Hash className="h-3 w-3 text-gray-400" />
              {/* <span className="text-gray-600">Adm:</span> */}
              <span className="font-medium text-gray-900 truncate">
                {student.admissionNumber}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className="text-gray-900 truncate font-medium">
                {student.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className="text-gray-900 font-medium">{student.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className="text-gray-600 truncate">
                {student.address.city}, {student.address.state}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className="text-gray-600">
                DOB: {new Date(student.dob).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Guardian Info */}
          <div className="bg-gray-50 rounded-lg p-3 mt-3">
            <div className="text-xs text-gray-600 mb-1">Guardian</div>
            <div className="font-medium text-sm text-gray-900">
              {student.guardian.name}
            </div>
            <div className="text-xs text-gray-600">
              {student.guardian.relation} • {student.guardian.phone}
            </div>
          </div>
        </CardContent>

        {/* Action Buttons */}
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex gap-2 flex-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                navigate(`/school/students/profile/${student.studentId}`)
              }
              className="flex-1 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                navigate(`/school/front-desk/edit-student/${student.studentId}`)
              }
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
                onClick={() =>
                  navigate(`/school/students/profile/${student._id}`)
                }
              >
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/school/front-desk/edit-student/${student._id}`)
                }
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Student
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                onClick={() => handleDeleteStudent(student._id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem> */}
              <DeleteModal student={student} />
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StudentCard;
