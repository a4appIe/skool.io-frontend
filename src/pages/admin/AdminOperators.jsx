import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminOperator = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm max-w-7xl rounded-lg m-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between py-8 flex-col md:flex-row gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mr-2 bg-red-600 rounded-md hover:bg-red-700 text-white hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Operators</h1>
                <p className="text-xs text-gray-500">
                  Manage system operators and permissions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1 bg-amber-100 text-amber-800 border-amber-200">
                Coming Soon
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl text-center">

          {/* Title */}
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Operators Module Coming Soon
          </h2>

          {/* Description */}
          {/* <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
            We're working on bringing you a powerful operator management system. 
            This feature will allow you to manage operators, assign roles, and control 
            system permissions.
          </p> */}

          {/* Features List */}
          <div className="bg-white rounded-lg p-8 mb-10 text-left max-w-lg mx-auto shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-red-600" />
              Upcoming Features:
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span>Create and manage operator accounts</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span>Assign roles and permissions</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span>Track operator activities</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span>Advanced access control</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mb-8">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-gray-300"
            >
              Go Back
            </Button>
            <Button
              onClick={() => navigate("/school")}
              className="bg-red-600 hover:bg-red-700"
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Timeline */}
          {/* <div className="pt-6 border-t border-gray-200 inline-block">
            <p className="text-sm text-gray-500">
              Expected Launch: <span className="font-semibold text-gray-700">Q4 2025</span>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminOperator;
