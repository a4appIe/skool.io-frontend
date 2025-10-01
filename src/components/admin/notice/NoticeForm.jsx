import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { AlertCircle, Bell, GraduationCap, Save, User, UserCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const NoticeForm = ({
  notice = null,
  onClose,
  onSuccess,
  updateNotice,
  createNotice,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    audience: "all",
  });

  const isEditing = !!notice;

  useEffect(() => {
    if (notice) {
      setFormData({
        title: notice.title || "",
        message: notice.message || "",
        audience: notice.audience || "all",
      });
    } else {
      setFormData({
        title: "",
        message: "",
        audience: "all",
      });
    }
  }, [notice]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateNotice(notice._id, formData);
        toast.success("Notice updated successfully!");
      } else {
        await createNotice(formData);
        toast.success("Notice created successfully!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving notice:", error);
      toast.error("Failed to save notice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateProgress = () => {
    const requiredFields = [formData.title, formData.message];
    const completed = requiredFields.filter(
      (field) => field && field.toString().trim()
    ).length;
    return Math.round((completed / requiredFields.length) * 100);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-700 rounded-lg">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? "Edit Notice" : "Add New Notice"}
              </h2>
              <p className="text-gray-600">
                {isEditing
                  ? "Edit the notice details"
                  : "Create a new notice for your institution"}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Form Completion
            </span>
            <span className="text-sm text-gray-600">
              {calculateProgress()}%
            </span>
          </div>
          <Progress value={calculateProgress()} className="h-2 bg-white" />
        </div>
      </div>

      {/* Form Content */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Notice Information Header */}
            <div className="flex items-center gap-2 mb-6">
              <Bell className="h-5 w-5 text-red-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                Notice Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 font-medium">
                  Notice Title <span className="text-red-700">*</span>
                </Label>
                <div className="relative">
                  <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter notice title"
                    className="border-gray-200 focus:border-red-700 focus:ring-red-700 pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Example: School Holiday, Parent Meeting, Exam Schedule
                </p>
              </div>

              {/* Audience Field */}
              <div className="space-y-2">
                <Label htmlFor="audience" className="text-gray-700 font-medium">
                  Target Audience <span className="text-red-700">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                  <Select
                    value={formData.audience}
                    onValueChange={(value) =>
                      handleInputChange("audience", value)
                    }
                  >
                    <SelectTrigger className="border-gray-200 focus:border-red-700 focus:ring-red-700 pl-10">
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>All (Teachers & Students)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="teacher">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          <span>Teachers Only</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="student">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          <span>Students Only</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-500">
                  Select who should receive this notice
                </p>
              </div>

              {/* Message Field */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="message" className="text-gray-700 font-medium">
                  Notice Message <span className="text-red-700">*</span>
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Enter detailed notice message"
                  rows={6}
                  className="border-gray-200 focus:border-red-700 focus:ring-red-700 resize-none"
                  required
                />
                <p className="text-xs text-gray-500">
                  Provide detailed information about the notice
                </p>
              </div>
            </div>

            {/* Form Guidelines */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Required Information:</p>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Notice Title: A clear and descriptive title</li>
                    <li>Target Audience: Who should receive this notice</li>
                    <li>Message: Detailed information about the notice</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Audience Preview */}
            {formData.audience && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">
                      This notice will be visible to:
                      <span className="ml-1">
                        {formData.audience === "all"
                          ? "All Users"
                          : formData.audience === "teacher"
                          ? "Teachers Only"
                          : "Students Only"}
                      </span>
                    </p>
                    <p className="text-xs">
                      {formData.audience === "all"
                        ? "Both teachers and students will see this notice"
                        : `Only ${formData.audience}s will have access to this notice`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-end">
          <Button
            type="submit"
            disabled={
              isSubmitting || !formData.title.trim() || !formData.message.trim()
            }
            className="bg-red-700 hover:bg-red-800 text-white flex-1 sm:flex-none"
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? "Update Notice" : "Create Notice"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoticeForm;
