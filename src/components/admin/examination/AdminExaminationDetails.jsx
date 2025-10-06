/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Upload,
  Eye,
  Calendar,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  CircleCheckBig,
  X,
  Repeat,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import {
  getExamination,
  updateExaminationStatus,
  uploadDatesheet,
} from "@/services/examination.service";

const AdminExaminationDetails = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [examination, setExamination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDatesheet, setSelectedDatesheet] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pdfScale, setPdfScale] = useState(1);

  const DATESHEET_PATH =
    import.meta.env.VITE_DATESHEET_PATH || "/uploads/examinations";
  console.log(DATESHEET_PATH);

  const fetchExamDetails = async () => {
    setLoading(true);
    let exam = await getExamination(examId);
    console.log(exam);
    if (exam) {
      setExamination(exam);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExamDetails();
  }, []);

  // Open upload dialog
  const handleUploadClick = (classData) => {
    setSelectedClass(classData);
    setUploadDialogOpen(true);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);

    try {
      let uploadedFile = await uploadDatesheet(
        examId,
        selectedClass._id,
        uploadFile
      );
      if (uploadedFile) {
        fetchExamDetails();
        toast.success(
          `Datesheet uploaded successfully for ${selectedClass.className}`
        );
      }
      setUploadDialogOpen(false);
      setUploadFile(null);
      setSelectedClass(null);
    } catch (error) {
      toast.error("Failed to upload datesheet");
    } finally {
      setUploading(false);
    }
  };

  // Check if file is PDF
  const isPDF = (fileName) => {
    return fileName?.toLowerCase().endsWith(".pdf");
  };

  // Handle view datesheet
  const handleViewDatesheet = (classData) => {
    if (!classData.datesheetUrl) {
      toast.error("No datesheet available, please upload");
      return;
    }
    console.log(`${DATESHEET_PATH}/${classData.datesheetUrl}`);

    setSelectedDatesheet({
      className: classData?.class?.className,
      fileName: classData.datesheetUrl,
      url: `${DATESHEET_PATH}/${classData.datesheetUrl}`,
    });
    setViewDialogOpen(true);
    setPdfScale(1); // Reset zoom
  };

  // Handle download datesheet
  const handleDownloadDatesheet = (classData) => {
    if (!classData.datesheetUrl) {
      toast.error("No datesheet available to download");
      return;
    }

    const link = document.createElement("a");
    link.href = `${DATESHEET_PATH}/${classData.datesheetUrl}`;
    link.download = classData.datesheetUrl;
    link.click();
    toast.success(`Downloading datesheet for ${classData?.class?.className}`);
  };

  const handleChangeStatus = async () => {
    try {
      let updatedExam = await updateExaminationStatus(examId);
      if (updatedExam) {
        fetchExamDetails();
      }
    } catch (error) {
      toast.error("Failed to change examination status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm rounded-xl">
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
                  <h1 className="text-2xl font-bold text-gray-900">
                    {examination.name}
                  </h1>
                  <p className="text-xs text-gray-500">
                    Examination Details & Datesheets
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Examination Info Card */}
        <Card className="border-gray-200 p-0 overflow-hidden">
          <CardHeader className="bg-red-50 p-2">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Calendar className="h-5 w-5" />
              Examination Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div>
                <Label className="text-sm text-gray-600">
                  Examination Name
                </Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {examination.name}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Start Date</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatDate(examination.startDate)}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">End Date</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatDate(examination.endDate)}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Active</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1 flex items-center gap-2">
                  {examination?.status ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200 py-1">
                      <CircleCheckBig className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 border-red-200 py-1">
                      <X className="h-3 w-3" />
                      Not Active
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleChangeStatus}
                    className={`border-gray-300 mr-2 ${
                      examination.status
                        ? "bg-red-600 hover:bg-red-700 text-white hover:text-white"
                        : "bg-green-600 hover:bg-green-700 text-white hover:text-white"
                    }`}
                  >
                    <Repeat className="h-4 w-4" />
                    {examination.status ? "Deactivate" : "Activate"}
                  </Button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classes & Datesheets Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-600" />
              Class-wise Datesheets
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Class Name
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Datesheet Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examination?.classes?.map((classData) => (
                    <TableRow
                      key={classData?.class?._id}
                      className="hover:bg-gray-50 border-b border-gray-100"
                    >
                      <TableCell className="font-medium text-gray-900">
                        {classData?.class?.className}
                      </TableCell>
                      <TableCell>
                        {classData?.datesheetUrl ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            <XCircle className="h-3 w-3 mr-1" />
                            Not Uploaded
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDatesheet(classData)}
                            className="border-gray-300 flex-2"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUploadClick(classData?.class)}
                            className="bg-red-600 hover:bg-red-700 flex-1"
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            {classData.datesheetUrl ? "Re-upload" : "Upload"}
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadDatesheet(classData)}
                            className="border-gray-300 disabled:opacity-20 disabled:cursor-not-allowed"
                            disabled={!classData.datesheetUrl}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-red-600" />
                Upload Datesheet
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Class
                </Label>
                <Input
                  value={selectedClass?.className || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Select File <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="datesheet-file"
                  type="file"
                  accept=".pdf,.xlsx,.xls"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="border-gray-300"
                />
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, Excel (.xlsx, .xls)
                </p>
              </div>

              {uploadFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800 font-medium">
                      {uploadFile.name}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Size: {(uploadFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setUploadDialogOpen(false);
                  setUploadFile(null);
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleFileUpload}
                disabled={!uploadFile || uploading}
                className="bg-red-600 hover:bg-red-700"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Datesheet
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* PDF Viewer Modal */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden [&>button]:hidden">
            <DialogHeader className="px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-red-600" />
                  {selectedDatesheet?.className}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = selectedDatesheet?.url;
                      link.download = selectedDatesheet?.fileName;
                      link.click();
                      toast.success("Downloading datesheet...");
                    }}
                    className="border-gray-300"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setViewDialogOpen(false);
                    }}
                    className="border-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              {selectedDatesheet && (
                <>
                  {isPDF(selectedDatesheet.fileName) ? (
                    // PDF Viewer using iframe
                    <div className="w-full flex items-center justify-center">
                      <iframe
                        src={selectedDatesheet.url}
                        className="w-full h-full bg-white shadow-lg rounded"
                        title="Datesheet PDF Viewer"
                        style={{
                          minHeight: "600px",
                          height: "80vh", // gives a clear vertical height
                          transform: `scale(${pdfScale})`,
                          transformOrigin: "top center",
                        }}
                      />
                    </div>
                  ) : (
                    // Image files
                    <div className="w-full flex items-center justify-center">
                      <img
                        src={selectedDatesheet.url}
                        alt="Datesheet"
                        className="max-w-full max-h-full object-contain shadow-lg rounded"
                        style={{
                          height: "80vh", // gives a clear vertical height
                          transform: `scale(${pdfScale})`,
                          transformOrigin: "center",
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminExaminationDetails;
