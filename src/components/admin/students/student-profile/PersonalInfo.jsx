import { Separator } from "@radix-ui/react-dropdown-menu";
import { TabsContent } from "@radix-ui/react-tabs";
import { Badge, Globe, School, User } from "lucide-react";
import React from "react";

const PersonalInfo = ({ student }) => {
  return (
    <TabsContent value="personal" className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4 bg-red-100 p-6 rounded-lg border border-red-500">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5 text-red-700" />
            Basic Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Full Name:</span>
              <span className="font-medium">{student.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium">{student.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date of Birth:</span>
              <span className="font-medium">
                {new Date(student.dob).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Blood Group:</span>
              <span className="font-medium">{student.bloodGroup}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium">{student.category}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-red-100 p-6 rounded-lg border border-red-500">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Globe className="h-5 w-5 text-red-700" />
            Identity Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Nationality:</span>
              <span className="font-medium">{student.nationality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Religion:</span>
              <span className="font-medium">{student.religion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Caste:</span>
              <span className="font-medium">{student.caste}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Aadhar Number:</span>
              <span className="font-medium font-mono">
                {student.aadharNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-red-100 p-6 rounded-lg border border-red-500">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <School className="h-5 w-5 text-red-700" />
            Academic Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Class:</span>
              <span className="font-medium">{student.studentClass.className}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Username:</span>
              <span className="font-medium">{student.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Admission No:</span>
              <span className="font-medium">{student.admissionNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Admission Date:</span>
              <span className="font-medium">
                {new Date(student.admissionDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Previous School Info */}
      {student.hasPreviousSchool && (
        <>
          <Separator className="my-8" />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <School className="h-5 w-5 text-red-700" />
              Previous School Information
            </h3>
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="">School Name:</span>
                    <span className="font-medium">
                      {student.previousSchool.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Board:</span>
                    <span className="font-medium">
                      {student.previousSchool.board}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="">Medium:</span>
                    <span className="font-medium">
                      {student.previousSchool.mediumOfInstruction}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Last Class:</span>
                    <span className="font-medium">
                      {student.previousSchool.lastClassAttended}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="">TC Number:</span>
                    <span className="font-medium">
                      {student.previousSchool.tcNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">TC Date:</span>
                    <span className="font-medium">
                      {new Date(
                        student.previousSchool.tcIssueDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </TabsContent>
  );
};

export default PersonalInfo;
