import { Button } from "@/components/ui/button";
import { TabsContent } from "@radix-ui/react-tabs";
import { PhoneCall, Send, UserCheck } from "lucide-react";
import React from "react";

const FamilyInfo = ({ student }) => {
  // Action handlers
  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, "_self");
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`, "_self");
  };
  return (
    <TabsContent value="family" className="p-6">
      <div className="space-y-8">
        {/* Guardian Information */}
        <div className="bg-red-100 border border-red-500 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Primary Guardian
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium uppercase">{student.guardian.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Relation:</span>
                <span className="font-medium">{student.guardian.relation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occupation:</span>
                <span className={`font-medium ${student.guardian.occupation ? 'text-gray-900' : 'text-gray-500'}`}>
                  {student.guardian.occupation || "Not specified"}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phone:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{student.guardian.phone}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCall(student.guardian.phone)}
                    className="h-8 w-8 p-0 border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <PhoneCall className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {student.guardian.email}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEmail(student.guardian.email)}
                    className="h-8 w-8 p-0 border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parents Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mother Information */}
          <div className="bg-pink-100 border border-pink-500 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-pink-800 mb-4">
              Mother Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium uppercase">{student.mother.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phone:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{student.mother.phone}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCall(student.mother.phone)}
                    className="h-8 w-8 p-0 border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <PhoneCall className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occupation:</span>
                <span className="font-medium">{student.mother.occupation}</span>
              </div>
            </div>
          </div>

          {/* Father Information */}
          <div className="bg-blue-100 border border-blue-500 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Father Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium uppercase">{student.father.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phone:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{student.father.phone}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCall(student.father.phone)}
                    className="h-8 w-8 p-0 border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <PhoneCall className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occupation:</span>
                <span className="font-medium">{student.father.occupation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default FamilyInfo;
