import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Calendar,
  Award,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Image as ImageIcon,
  FileText,
  Languages,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getSchool } from "@/services/school.service";
import { SCHOOL_PATH } from "@/utils/constants";

export default function AdminSchoolProfilePage() {
  const navigate = useNavigate();
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchoolProfile();
  }, []);

  const fetchSchoolProfile = async () => {
    try {
      setLoading(true);
      const data = await getSchool();
      if (data) {
        setSchoolData(data);
      }
    } catch (error) {
      console.error("Error fetching school profile:", error);
      toast.error("Failed to load school profile");
    } finally {
      setLoading(false);
    }
  };

  const handleContactUs = () => {
    // Open contact form or navigate to contact page
    // toast.info("Contact form opening soon!");
    // Or navigate to a contact page:
    navigate("/school/profile/query");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
      </div>
    );
  }

  if (!schoolData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              School Profile Not Found
            </h2>
            <Button
              onClick={() => navigate(-1)}
              className="mt-4 bg-red-700 hover:bg-red-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm rounded-xl">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between py-8 flex-col md:flex-row gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="mr-2 bg-red-700 rounded-md hover:bg-red-800 text-white hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    School Profile
                  </h1>
                  <p className="text-xs text-gray-500">
                    View and manage school information
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleContactUs}
                  className="bg-red-700 hover:bg-red-800 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Query? Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - School Logo & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Logo Card */}
            <Card className="shadow-sm">
              <CardContent className="px-6">
                <div className="text-center">
                  {schoolData.logo ? (
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-red-100 shadow-lg">
                      <img
                        src={`${SCHOOL_PATH}/${schoolData.logo}`}
                        alt={schoolData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-white" />
                    </div>
                  )}
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {schoolData.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">
                    {schoolData.ownerName}
                  </p>
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    {schoolData.recognition || "Not Recognized"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info Card */}
            <Card className="shadow-sm p-0">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-red-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Affiliation</p>
                    <p className="font-semibold text-gray-900">
                      {schoolData.affiliationNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <Award className="h-5 w-5 text-red-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Board</p>
                    <p className="font-semibold text-gray-900">
                      {schoolData.board}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-red-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Established</p>
                    <p className="font-semibold text-gray-900">
                      {schoolData.yearEstablished}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-red-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Session</p>
                    <p className="font-semibold text-gray-900">
                      {schoolData.session}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Languages Card */}
            {schoolData.mediumOfInstruction && (
              <Card className="shadow-sm p-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Languages className="h-5 w-5 text-red-700" />
                    <h3 className="font-semibold text-gray-900">
                      Medium of Instruction
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {schoolData.mediumOfInstruction.map((lang, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-100 text-gray-800"
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Banner Card */}
            {schoolData.banner && (
              <Card className="shadow-sm overflow-hidden p-0">
                <div className="relative h-48 bg-gradient-to-r from-red-700 to-red-800">
                  <img
                    src={`${SCHOOL_PATH}/${schoolData.banner}`}
                    alt="School Banner"
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-6">
                    <h3 className="text-white text-2xl font-bold">
                      {schoolData.name}
                    </h3>
                  </div>
                </div>
              </Card>
            )}

            {/* Contact Information */}
            <Card className="shadow-sm p-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-red-700" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <a
                        href={`mailto:${schoolData.contact.email}`}
                        className="text-sm text-red-700 hover:text-red-800 flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        {schoolData.contact.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <a
                        href={`tel:${schoolData.contact.phone}`}
                        className="text-sm text-red-700 hover:text-red-800 flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        {schoolData.contact.phone}
                      </a>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {schoolData.contact.landline && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Landline</p>
                        <a
                          href={`tel:${schoolData.contact.landline}`}
                          className="text-sm text-red-700 hover:text-red-800 flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4" />
                          {schoolData.contact.landline}
                        </a>
                      </div>
                    )}
                    {schoolData.contact.website && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Website</p>
                        <a
                          href={schoolData.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-red-700 hover:text-red-800 flex items-center gap-2"
                        >
                          <Globe className="h-4 w-4" />
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Card */}
            <Card className="shadow-sm p-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-700" />
                  Address
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>{schoolData.address.line1}</p>
                  {schoolData.address.line2 && (
                    <p>{schoolData.address.line2}</p>
                  )}
                  <p>
                    {schoolData.address.city}, {schoolData.address.state}
                  </p>
                  <p>
                    {schoolData.address.country} -{" "}
                    {schoolData.address.postalCode}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Documents Card */}
            {schoolData.documents && schoolData.documents.length > 0 && (
              <Card className="shadow-sm p-0">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-700" />
                    Documents
                  </h3>
                  <div className="space-y-3">
                    {schoolData.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-red-100 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-red-700" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {doc.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              PDF Document
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(doc.file, "_blank")}
                          className="border-red-200 hover:bg-red-50"
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* System Info */}
            <Card className="shadow-sm bg-gray-50 p-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  System Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Username</p>
                    <p className="font-medium text-gray-900">
                      {schoolData.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">UDISE Code</p>
                    <p className="font-medium text-gray-900">
                      {schoolData.udiseCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">School Code</p>
                    <p className="font-medium text-gray-900">
                      {schoolData.code}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Updated</p>
                    <p className="font-medium text-gray-900">
                      {new Date(schoolData.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
