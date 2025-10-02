import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Mail, MapPin, Phone, User } from "lucide-react";
import React from "react";

// Teacher Details Card Component
const TeacherDetailsCard = ({ teacher }) => {
  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            {teacher?.profileImage ? (
              <img
                src={teacher?.profileImage}
                alt={teacher?.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-gray-500" />
            )}
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              {teacher?.name}
            </CardTitle>
            <p className="text-gray-600">{teacher?.department}</p>
            <p className="text-sm text-gray-500">ID: {teacher?.teacherId}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{teacher?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{teacher?.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p>{teacher?.address.street}</p>
                <p>
                  {teacher?.address.city}, {teacher?.address.state}{" "}
                  {teacher?.address.zipCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Information */}
        {/* <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Bank Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Bank:</span>
              <span className="font-medium">
                {teacher.bankDetails.bankName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account:</span>
              <span className="font-medium">
                {teacher.bankDetails.accountNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Routing:</span>
              <span className="font-medium">
                {teacher.bankDetails.routingNumber}
              </span>
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default TeacherDetailsCard;
