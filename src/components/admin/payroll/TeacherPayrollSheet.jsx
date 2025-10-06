import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Calendar,
  CreditCard,
  DollarSign,
  User,
  X,
  Phone,
  IndianRupee,
} from "lucide-react";
import React from "react";

// Fixed: Proper props destructuring
const TeacherPayrollSheet = ({
  selectedTeacher,
  setSelectedTeacher,
  selectedMonth,
  loading,
  setSelectedMonth,
  handleProcessPayment,
}) => {
  const months = [
    { label: "January" },
    { label: "February" },
    { label: "March" },
    { label: "April" },
    { label: "May" },
    { label: "June" },
    { label: "July" },
    { label: "August" },
    { label: "September" },
    { label: "October" },
    { label: "November" },
    { label: "December" },
  ];

  const handleCloseSheet = () => {
    if (!loading) {
      setSelectedTeacher(null);
      setSelectedMonth("1");
    }
  };

  return (
    <Sheet
      open={!!selectedTeacher}
      onOpenChange={(open) => {
        if (!open) {
          handleCloseSheet();
        }
      }}
      modal={false}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 border-gray-200 [&>button]:hidden"
      >
        {/* Custom Close Button */}
        <div className="absolute right-4 top-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseSheet}
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
          <SheetHeader className="text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-700 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold text-gray-900">
                  Process Payment
                </SheetTitle>
                <SheetDescription className="text-gray-600">
                  Pay salary to {selectedTeacher?.name}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* Content */}
        <ScrollArea
          className="flex-1 px-6 py-6"
          style={{ height: "calc(100vh - 200px)" }}
        >
          <div className="space-y-6">
            {/* Teacher Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-red-700" />
                <h3 className="font-semibold text-gray-900">
                  Teacher Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Teacher Name
                  </Label>
                  <Input
                    value={selectedTeacher?.name || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    value={selectedTeacher?.email || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Phone
                  </Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <Input
                      value={selectedTeacher?.phone || "N/A"}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-red-700" />
                <h3 className="font-semibold text-gray-900">Payment Details</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Payment Amount
                  </Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-700" />
                    <Input
                      value={selectedTeacher?.salary || 0}
                      disabled
                      className="bg-gray-50 pl-10 text-lg font-semibold text-red-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Payment Month <span className="text-red-700">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                    <Select
                      value={selectedMonth}
                      onValueChange={setSelectedMonth}
                    >
                      <SelectTrigger className="pl-10 focus:border-red-700 focus:ring-red-700">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.label} value={month.label}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CreditCard className="h-4 w-4 text-red-700 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">Payment Information:</p>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Payment will be processed via Bank Transfer</li>
                    <li>Teacher will receive payment confirmation via email</li>
                    <li>Processing may take 1-2 business days</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <SheetFooter>
            <Button
              className="w-full bg-red-700 hover:bg-red-800"
              onClick={handleProcessPayment}
              disabled={loading || !selectedMonth}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Process Payment
                </>
              )}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TeacherPayrollSheet;
