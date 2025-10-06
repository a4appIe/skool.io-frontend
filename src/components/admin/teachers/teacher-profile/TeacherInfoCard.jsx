import { Card } from "@/components/ui/card";
import { TEACHER_PATH } from "@/utils/constants";
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Hash,
  Mail,
  MapPin,
  Phone,
  Star,
  Users,
} from "lucide-react";
import React from "react";

const TeacherInfoCard = ({ teacher }) => {
  return (
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
                    <span className="">{teacher.designation || "Teacher"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{teacher.department || "Academic Department"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <span>{teacher?.username}</span>
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
                    Joined: {new Date(teacher.joiningDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    {teacher.performanceMetrics?.studentsCount || 0} students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span className="text-sm">
                    {teacher.performanceMetrics?.subjectsTeaching || 0} subjects
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TeacherInfoCard;
