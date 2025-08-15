/* eslint-disable no-unused-vars */
// components/ClassScheduleUploadDialog.jsx
import React, { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  X,
  Loader2,
  FileText,
  FileUp,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import useScheduleStore from "@/store/useScheduleStore";
import { templateData } from "./templateData";
import { API_URL } from "@/utils/constants";
import { createPeriod } from "@/services/periods.service";
import usePeriodStore from "@/store/usePeriodStore";

const AddPeriods = ({ classId, className = "Selected Class" }) => {
  // Dialog and upload state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Store hooks
  const { getSchedules } = useScheduleStore((state) => state);
  const { periods } = usePeriodStore((state) => state);
  console.log(periods)

  // Download template file
  const downloadTemplate = useCallback(() => {
    try {
      const ws = XLSX.utils.aoa_to_sheet(templateData);

      // Set column widths for better formatting
      ws["!cols"] = [
        { wch: 12 }, // Day
        { wch: 20 }, // Subject
        { wch: 20 }, // Teacher
        { wch: 12 }, // StartTime
        { wch: 12 }, // EndTime
      ];

      // Style the header row
      const range = XLSX.utils.decode_range(ws["!ref"]);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "DC2626" } },
            alignment: { horizontal: "center", vertical: "center" },
          };
        }
      }

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Class Schedule Template");

      const filename = `${className.replace(
        /[^a-z0-9]/gi,
        "_"
      )}_Periods_Template.xlsx`;
      XLSX.writeFile(wb, filename);

      toast.success("Template downloaded successfully!");
    } catch (error) {
      console.error("Template download error:", error);
      toast.error("Failed to download template");
    }
  }, [className]);

  // Preview file content
  const previewFile = useCallback(async (file) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const isValidFormat =
            jsonData.length > 1 &&
            jsonData[0].length >= 5 &&
            jsonData[0].includes("Day") &&
            jsonData[0].includes("Subject") &&
            jsonData[0].includes("Teacher") &&
            jsonData[0].includes("StartTime") &&
            jsonData[0].includes("EndTime");

          setFilePreview({
            fileName: file.name,
            fileSize: (file.size / 1024).toFixed(2),
            totalRows: jsonData.length - 1,
            previewData: jsonData.slice(0, 6),
            isValid: isValidFormat,
            error: !isValidFormat
              ? "Invalid file format. Please use the provided template."
              : null,
          });
        } catch (error) {
          console.error("File preview error:", error);
          setFilePreview({
            fileName: file.name,
            fileSize: (file.size / 1024).toFixed(2),
            isValid: false,
            error: "Unable to read Excel file. Please check the file format.",
          });
        }
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error("Preview error:", error);
      toast.error("Error previewing file");
    }
  }, []);

  // Handle file selection with validation
  const handleFileSelect = useCallback(
    (file) => {
      if (!file) return;

      // Validate file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];

      const isValidType =
        validTypes.includes(file.type) ||
        file.name.toLowerCase().endsWith(".xlsx") ||
        file.name.toLowerCase().endsWith(".xls");

      if (!isValidType) {
        toast.error("Please select a valid Excel file (.xlsx or .xls)");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      previewFile(file);
    },
    [previewFile]
  );

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  // Reset dialog state
  const resetDialogState = useCallback(() => {
    setSelectedFile(null);
    setFilePreview(null);
    setUploading(false);
    setIsDragOver(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Handle dialog close
  const handleDialogClose = useCallback(() => {
    if (!uploading) {
      resetDialogState();
      setIsOpen(false);
    }
  }, [uploading, resetDialogState]);

  // Handle file upload
  const handleUpload = useCallback(
    async (e) => {
      e.preventDefault();
      if (!selectedFile || !classId) {
        toast.error("Missing file or class information");
        return;
      }

      if (!filePreview?.isValid) {
        toast.error("Please select a valid file before uploading");
        return;
      }

      setUploading(true); // ✅ Needed before axios.post
      try {
        const formData = new FormData();
        formData.append("periods", selectedFile);
        formData.append("classId", classId);
        console.log(API_URL);
        console.log("Formdata being sent:");
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value instanceof File ? value.name : value}`);
        }
        await createPeriod(formData);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload class periods");
      } finally {
        setUploading(false);
      }
    },
    [selectedFile, classId, filePreview]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <FileUp className="h-4 w-4 mr-2" />
          Upload Class Schedule
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <FileSpreadsheet className="h-6 w-6 text-blue-600" />
            Upload Class Schedule
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              {className}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Upload an Excel file containing class periods for {className}.
            Download the template first to ensure proper formatting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-blue-900 mb-1">
                  Step 1: Download Template
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Get the Excel template with the correct format including
                  sample data for reference.
                </p>
                <Button
                  onClick={downloadTemplate}
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* File Upload Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-600" />
              Step 2: Upload Your Schedule File
            </h4>

            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all duration-200 ${
                isDragOver
                  ? "border-blue-500 bg-blue-50 scale-[1.02]"
                  : selectedFile
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-3">
                  <FileSpreadsheet className="h-12 w-12 text-green-600 mx-auto" />
                  <div>
                    <p className="font-medium text-green-800 truncate max-w-xs mx-auto">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-green-600">
                      {(selectedFile.size / 1024).toFixed(2)} KB • Ready to
                      upload
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetDialogState}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload
                    className={`h-12 w-12 mx-auto transition-colors ${
                      isDragOver ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {isDragOver
                        ? "Drop your file here"
                        : "Drag and drop your Excel file"}
                    </p>
                    <p className="text-gray-600 mt-1">
                      or{" "}
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        browse files
                      </button>
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Supports .xlsx and .xls files up to 10MB
                  </p>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
              className="hidden"
            />
          </div>

          {/* File Preview Section */}
          {filePreview && (
            <div className="bg-gray-50 border rounded-lg p-4 space-y-4">
              <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                File Preview
              </h5>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 block">File:</span>
                  <p className="font-medium truncate">{filePreview.fileName}</p>
                </div>
                <div>
                  <span className="text-gray-600 block">Size:</span>
                  <p className="font-medium">{filePreview.fileSize} KB</p>
                </div>
                <div>
                  <span className="text-gray-600 block">Rows:</span>
                  <p className="font-medium">
                    {filePreview.totalRows || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 block">Status:</span>
                  <Badge
                    variant={filePreview.isValid ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {filePreview.isValid ? "Valid" : "Invalid"}
                  </Badge>
                </div>
              </div>

              {filePreview.error ? (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {filePreview.error}
                  </AlertDescription>
                </Alert>
              ) : (
                filePreview.previewData && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs border border-gray-200 rounded">
                      <thead className="bg-gray-100">
                        <tr>
                          {filePreview.previewData[0]?.map((header, index) => (
                            <th
                              key={index}
                              className="px-3 py-2 text-left font-medium text-gray-700 border-b"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filePreview.previewData
                          .slice(1)
                          .map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className={
                                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-3 py-2 border-b text-gray-600"
                                >
                                  {cell || "-"}
                                </td>
                              ))}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {filePreview.totalRows > 5 && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Showing first 5 rows of {filePreview.totalRows} total
                        rows
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Important Instructions
            </h5>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>Use the provided template format exactly</li>
              <li>
                Day: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
              </li>
              <li>Time format: HH:MM (24-hour format, e.g., 09:00, 14:30)</li>
              <li>Subject and Teacher names must match existing records</li>
              <li>Duplicate time slots will be rejected</li>
              <li>Empty cells will be ignored</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={handleDialogClose}
            disabled={uploading}
            className="w-full sm:w-auto"
          >
            {uploading ? "Cancel" : "Close"}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !filePreview?.isValid || uploading}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Schedule
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPeriods;
