import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import React from "react";

const ScheduleFileStatus = ({ state, classPeriodsEvents, getClassName }) => {
  return (
    <>
      {state.selectedClassFilter !== "all" && (
        <Card
          className={`shadow-sm border-l-4 ${
            classPeriodsEvents.length > 0
              ? "border-l-green-500 bg-green-50/50"
              : "border-l-orange-500 bg-orange-50/50"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {classPeriodsEvents.length > 0 ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h4
                  className={`font-semibold ${
                    classPeriodsEvents.length > 0
                      ? "text-green-800"
                      : "text-orange-800"
                  }`}
                >
                  {classPeriodsEvents.length > 0
                    ? `Class view: ${getClassName(state.selectedClassFilter)}`
                    : `No periods found: ${getClassName(
                        state.selectedClassFilter
                      )} `}
                </h4>
                <p
                  className={`text-sm mt-1 ${
                    classPeriodsEvents.length > 0
                      ? "text-green-700"
                      : "text-orange-700"
                  }`}
                >
                  {classPeriodsEvents.length > 0
                    ? `Found ${classPeriodsEvents.length} recurring periods.`
                    : `You may have not uploaded the periods.`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ScheduleFileStatus;
