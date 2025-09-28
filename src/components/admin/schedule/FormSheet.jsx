import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarX,
  Edit3,
  Hotel,
  PartyPopper,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import React from "react";

const FormSheet = ({
  handleSubmit,
  state,
  handleInputChange,
  handleDeleteSchedule,
  handleCloseSheet,
  SCHEDULE_TYPES,
}) => {
  return (
    <Sheet open={state.isSheetOpen} onOpenChange={handleCloseSheet}>
      <SheetContent
        side="right"
        className="!w-full sm:!w-[600px] !max-w-none p-0 border-gray-200 overflow-y-auto [&>button]:hidden"
      >
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 lg:p-6">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-white text-lg lg:text-xl">
              {state.isEditMode ? (
                <>
                  <Edit3 className="h-5 w-5 lg:h-6 lg:w-6" />
                  Edit{" "}
                  {state.formData.type === SCHEDULE_TYPES.EVENT
                    ? "Event"
                    : "Holiday"}
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 lg:h-6 lg:w-6" />
                  Add New{" "}
                  {state.formData.type === SCHEDULE_TYPES.EVENT
                    ? "Event"
                    : "Holiday"}
                </>
              )}
            </SheetTitle>
            <SheetDescription className="text-red-100 text-sm">
              {state.isEditMode
                ? "Modify the details below. All fields marked with * are required."
                : state.formData.type === SCHEDULE_TYPES.HOLIDAY ||
                  state.formData.type === SCHEDULE_TYPES.EVENT
                ? "Create a priority event. This will hide all class periods on the selected date."
                : "Fill in the required details to create a new event or holiday."}
            </SheetDescription>
          </SheetHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">
              Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={state.formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SCHEDULE_TYPES.EVENT}>
                  <div className="flex items-center gap-2">
                    <PartyPopper className="h-4 w-4 text-red-600" />
                    Event
                  </div>
                </SelectItem>
                <SelectItem value={SCHEDULE_TYPES.HOLIDAY}>
                  <div className="flex items-center gap-2">
                    <Hotel className="h-4 w-4 text-orange-600" />
                    Holiday
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {state.formErrors.type && (
              <p className="text-sm text-red-500">{state.formErrors.type}</p>
            )}
            {(state.formData.type === SCHEDULE_TYPES.HOLIDAY ||
              state.formData.type === SCHEDULE_TYPES.EVENT) && (
              <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                <CalendarX className="h-3 w-3 inline mr-1" />
                Creating a {state.formData.type} will automatically hide all
                class periods on this date.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={state.formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder={`Enter ${state.formData.type} title`}
              className="w-full"
            />
            {state.formErrors.title && (
              <p className="text-sm text-red-500">{state.formErrors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={state.formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder={`Enter ${state.formData.type} description`}
              rows={3}
              className="w-full resize-none"
            />
            {state.formErrors.description && (
              <p className="text-sm text-red-500">
                {state.formErrors.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              disabled={state.isEditMode}
              id="date"
              type="date"
              value={state.formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
            />
            {state.formErrors.date && (
              <p className="text-sm text-red-500">{state.formErrors.date}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">
                Start Time <span className="text-red-500">*</span>
              </Label>
              <Input
                disabled={state.isEditMode}
                id="startTime"
                type="time"
                value={state.formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                className="w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
              />
              {state.formErrors.startTime && (
                <p className="text-sm text-red-500">
                  {state.formErrors.startTime}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">
                End Time <span className="text-red-500">*</span>
              </Label>
              <Input
                disabled={state.isEditMode}
                id="endTime"
                type="time"
                value={state.formData.endTime}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
                className="w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
              />
              {state.formErrors.endTime && (
                <p className="text-sm text-red-500">
                  {state.formErrors.endTime}
                </p>
              )}
            </div>
          </div>

          <SheetFooter className="flex flex-col justify-end sm:flex-row gap-2 pt-4 border-t">
            {state.isEditMode && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteSchedule}
                className="w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}

            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto transition-all duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              {state.isEditMode ? "Update" : "Create"}{" "}
              {state.formData.type === SCHEDULE_TYPES.EVENT
                ? "Event"
                : "Holiday"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCloseSheet}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default FormSheet;
