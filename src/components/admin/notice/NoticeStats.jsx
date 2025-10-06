import { Card, CardContent } from "@/components/ui/card";
import { Bell, GraduationCap, UserCheck } from "lucide-react";
import React from "react";

const NoticeStats = ({ audienceFilter, setAudienceFilter, statistics }) => {
  return (
    <div className="flex flex-row gap-4 flex-wrap">
      <Card
        className={`flex-1 cursor-pointer transition-all duration-200 ${
          audienceFilter === "all"
            ? "ring-2 ring-blue-500 bg-blue-50"
            : "hover:shadow-md"
        }`}
        onClick={() => setAudienceFilter("all")}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Notices</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.all}
              </p>
            </div>
            <Bell className="h-8 w-8 text-gray-500" />
          </div>
        </CardContent>
      </Card>

      <Card
        className={`flex-1 cursor-pointer transition-all duration-200 ${
          audienceFilter === "teacher"
            ? "ring-2 ring-red-500 bg-red-50"
            : "hover:shadow-md"
        }`}
        onClick={() => setAudienceFilter("teacher")}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">For Teachers</p>
              <p className="text-2xl font-bold text-green-600">
                {statistics.teacher}
              </p>
            </div>
            <GraduationCap className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card
        className={`flex-1 cursor-pointer transition-all duration-200 ${
          audienceFilter === "student"
            ? "ring-2 ring-green-500 bg-green-50"
            : "hover:shadow-md"
        }`}
        onClick={() => setAudienceFilter("student")}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">For Students</p>
              <p className="text-2xl font-bold text-blue-600">
                {statistics.student}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoticeStats;
