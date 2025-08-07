import { Card } from "@/components/ui/card";
import {
  AtSign,
  Badge,
  Bookmark,
  Calendar,
  Globe,
  GraduationCap,
  Hash,
  Heart,
  Mail,
  MapPin,
  Phone,
  UserCheck,
} from "lucide-react";
import React from "react";

const BasicInfo = ({ student }) => {
  const STUDENT_PATH = import.meta.env.VITE_STUDENT_PATH;
  return (
    <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-red-600 to-red-700 overflow-hidden">
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
          {/* Student Image */}
          <div className="lg:col-span-1 flex justify-center lg:justify-start">
            <div className="relative">
              <img
                src={
                  student.studentImage
                    ? `${STUDENT_PATH}/${student.studentImage}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        student.name
                      )}&background=ef4444&color=fff&size=200`
                }
                alt={student.name}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    student.name
                  )}&background=ef4444&color=fff&size=200`;
                }}
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="lg:col-span-3 text-white">
            <h2 className="text-3xl font-bold mb-2 uppercase">
              {student.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <div className="space-y-2 bg-red-50 border border-black w-fit px-5 py-2 rounded-lg text-red-700">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span className="">{student.studentClass.className}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AtSign className="h-4 w-4" />
                    <span>{student.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    <span>Adm: {student.admissionNumber}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{student.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    DOB: {new Date(student.dob).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">Blood: {student.bloodGroup}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    {student.address.city}, {student.address.state}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  <span className="text-sm">
                    Guardian: {student.guardian.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">{student.nationality}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    Joined:{" "}
                    {new Date(student.admissionDate).toLocaleDateString()}
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

export default BasicInfo;
