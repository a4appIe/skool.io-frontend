import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, CalendarX, Filter, Loader2, Users } from "lucide-react";
import React from "react";

const ScheduleFilters = ({
  state,
  handleClassFilterChange,
  CLASSES_LIST,
  isProcessing,
  statistics,
  hiddenPeriodsCount,
}) => {
  return (
    <Card className="shadow-sm border-l-4 border-l-red-700">
      <CardContent className="p-4">
        <div className="flex flex-col xl:flex-row xl:items-center gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="h-5 w-5 text-red-700 flex-shrink-0" />
            <Label className="font-semibold text-gray-700 whitespace-nowrap">
              Filters:
            </Label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex-1 max-w-sm">
              <Label className="text-sm text-gray-600 mb-1 block">Class</Label>
              <Select
                value={state.selectedClassFilter}
                onValueChange={handleClassFilterChange}
              >
                <SelectTrigger className="w-full transition-colors">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES_LIST.map((cls) => (
                    <SelectItem key={cls._id} value={cls._id}>
                      <div className="flex items-center gap-2">
                        {cls._id === "all" ? (
                          <Users className="h-4 w-4 text-red-700" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-red-800" />
                        )}
                        {cls.className}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="secondary" className="bg-gray-100">
              {statistics.total} items showing
            </Badge>

            {state.selectedClassFilter !== "all" && (
              <div className="flex gap-1">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  Class Mode Active
                </Badge>
                {hiddenPeriodsCount > 0 && (
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                    <CalendarX className="h-3 w-3 mr-1" />
                    {hiddenPeriodsCount} Hidden
                  </Badge>
                )}
                {isProcessing && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Processing...
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleFilters;
