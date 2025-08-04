import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import { Download, Eye, FileText } from "lucide-react";
import React from "react";

const DocumentsInfo = ({ student }) => {
  // Action handlers
  const handleViewDocument = (document) => {
    window.open(document.url, "_blank");
  };
  const handleDownloadDocument = (document) => {
    const link = document.createElement("a");
    link.href = document.url;
    link.download = document.name;
    link.click();
  };
  return (
    <TabsContent value="documents" className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-700" />
            Student Documents ({student.documents.length})
          </h3>
        </div>

        {student.documents.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No documents uploaded
            </h3>
            <p className="text-gray-500">
              No documents have been uploaded for this student yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {student.documents.map((document, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow bg-red-100 border-red-500"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-red-700" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {document.name.toUpperCase()}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Uploaded:{" "}
                        {new Date(student.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDocument(document)}
                          className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadDocument(document)}
                          className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default DocumentsInfo;
