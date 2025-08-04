import { Button } from "@/components/ui/button";
import { TabsContent } from "@radix-ui/react-tabs";
import { ExternalLink, MapPin } from "lucide-react";
import React from "react";

const AddressInfo = ({ student }) => {
  return (
    <TabsContent value="address" className="p-6">
      <div className="bg-red-100 border border-red-500 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-red-700" />
          Residential Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Street Address:</span>
              <span className="font-medium text-right">
                {student.address.street}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">City:</span>
              <span className="font-medium">{student.address.city}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">State:</span>
              <span className="font-medium">{student.address.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pincode:</span>
              <span className="font-medium font-mono">
                {student.address.pincode}
              </span>
            </div>
          </div>
        </div>

        {/* Full Address Display */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-red-700 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Complete Address
              </h4>
              <p className="text-gray-700">
                {student.address.street}, {student.address.city},{" "}
                {student.address.state} - {student.address.pincode}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() =>
                  window.open(
                    `https://maps.google.com?q=${encodeURIComponent(
                      `${student.address.street}, ${student.address.city}, ${student.address.state} ${student.address.pincode}`
                    )}`,
                    "_blank"
                  )
                }
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Map
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default AddressInfo;
