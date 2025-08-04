/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Phone,
  Mail,
  CalendarDays,
  FileText,
  UserPlus,
  FileBadge2,
  Bell,
  CreditCard,
  FileInput,
  ClipboardList,
  User,
  Home,
  Plus,
  TrendingUp,
} from "lucide-react";

// Optionally import a charting lib for real data viz (mocked below)
// import { Line, Bar } from "react-chartjs-2"; // e.g.

// --- MOCK DATA ---
const stats = [
  {
    title: "Visitors Today",
    value: 37,
    icon: Home,
    color: "bg-red-100 text-red-700",
  },
  {
    title: "Phone Calls",
    value: 67,
    icon: Phone,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "New Admissions",
    value: 5,
    icon: UserPlus,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Fee Payments",
    value: 21,
    icon: CreditCard,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "Appointments",
    value: 9,
    icon: CalendarDays,
    color: "bg-violet-100 text-violet-700",
  },
  {
    title: "Certificates Issued",
    value: 8,
    icon: FileBadge2,
    color: "bg-teal-100 text-teal-700",
  },
  {
    title: "Mail/Emails",
    value: 15,
    icon: Mail,
    color: "bg-orange-100 text-orange-700",
  },
];

const quickActions = [
  { label: "New Admission", icon: UserPlus },
  { label: "Record Fee", icon: CreditCard },
  { label: "Send Notice", icon: Bell },
  { label: "Schedule Meeting", icon: CalendarDays },
  { label: "Print Certificate", icon: FileText },
  { label: "View Log Book", icon: ClipboardList },
];

const recentAdmissions = [
  { id: 1, name: "Riya Sahu", class: "5A", time: "Today, 10:15am" },
  { id: 2, name: "Rahul Verma", class: "3B", time: "Today, 09:48am" },
  { id: 3, name: "Tania Malik", class: "2A", time: "Yesterday, 03:05pm" },
];

const upcomingAppointments = [
  { name: "Parent: Aman Gupta", reason: "Meet Principal", time: "11:45am" },
  { name: "Maintenance Team", reason: "Annual Inspection", time: "2:00pm" },
];

const feeSummary = {
  today: 15000,
  pending: 4200,
  total: 193752,
};

const documentStatus = [
  { type: "Bonafide", name: "Arnav Mishra", status: "Ready" },
  { type: "Transfer", name: "Priya Rai", status: "Being prep." },
  { type: "Migration", name: "Simran Kaur", status: "Issued" },
];

// --- CHART MOCK DATA, replace with a chart library ---
function MiniStatsGraph({ value, trend }) {
  // You may replace with react-chartjs-2, recharts, nivo, etc.
  return (
    <div className="flex items-center gap-1">
      <TrendingUp className="text-green-600 h-4 w-4" />
      <span className="text-xs text-green-600 font-medium">+{trend || 2}</span>
    </div>
  );
}

// --- MAIN COMPONENT ---
export function AdminFrontDeskDashboard() {
  // Optionally: tabs for switching between sub-modules
  const [tab, setTab] = useState("overview");

  return (
    <div className="min-h-screen pb-6 bg-gray-50 flex flex-col">
      {/* Dashboard Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Front Desk
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening at your school.
        </p>
      </div>
      <div className="flex flex-col justify-center px-6 mt-4 pb-0 space-y-4">
        <div className="flex flex-wrap gap-3">
          {quickActions.map((a) => (
            <Button
              key={a.label}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 flex items-center gap-2 flex-1"
            >
              <a.icon className="h-4 w-4" />
              {a.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 px-6 my-6">
        {stats.map((s) => (
          <Card
            key={s.title}
            className="flex flex-row items-center gap-4 p-5 bg-white border-gray-200 shadow-none hover:shadow-lg transition-all"
          >
            <div className={`rounded-lg p-3 ${s.color} flex items-center`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-gray-900">
                  {s.value}
                </span>
                <MiniStatsGraph
                  value={s.value}
                  trend={Math.floor(Math.random() * 10)}
                />
              </div>
              <span className="block text-sm text-gray-600">{s.title}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs for Reception/Admissions/Fees Scheduling etc. */}
      <div className="px-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
            <TabsTrigger value="fees">Fee & Payments</TabsTrigger>
            <TabsTrigger value="documents">Docs</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Appointments and Admissions Column */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <CalendarDays className="h-5 w-5" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="p-4">
                  {upcomingAppointments.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 py-2 border-b last:border-b-0"
                    >
                      <User className="h-4 w-4" />
                      <div>
                        <span className="text-sm">{a.name}</span>
                        <div className="text-xs text-gray-500">
                          {a.reason} -{" "}
                          <span className="font-medium">{a.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Admissions Column */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <UserPlus className="h-5 w-5" />
                    Recent Admissions
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="p-4">
                  {recentAdmissions.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 py-2 border-b last:border-b-0"
                    >
                      <Badge className="bg-green-700 text-white mr-2">
                        {a.class}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">
                        {a.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {a.time}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Fee and Document Column */}
              <div className="col-span-1 flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-700">
                      <CreditCard className="h-5 w-5" />
                      Fee Collection Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-xs text-gray-600">Today:</div>
                    <div className="font-bold text-xl text-gray-800 mb-2">
                      ₹{feeSummary.today.toLocaleString()}
                    </div>
                    <Progress
                      value={(feeSummary.today / 20000) * 100}
                      className="h-2 bg-gray-100 mb-2"
                    />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>
                        Pending:{" "}
                        <span className="text-orange-700 font-semibold">
                          ₹{feeSummary.pending}
                        </span>
                      </span>
                      <span>
                        Total:{" "}
                        <span className="font-bold text-green-700">
                          ₹{feeSummary.total.toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-violet-700">
                      <FileBadge2 className="h-5 w-5" />
                      Docs & Certificates Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pb-2">
                    {documentStatus.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm py-1 border-b last:border-b-0"
                      >
                        <FileText className="text-gray-400 h-4 w-4" />
                        <span className="font-medium text-gray-900">
                          {d.type}
                        </span>{" "}
                        for <span className="text-gray-700">{d.name}</span>
                        <span
                          className={`ml-auto text-xs pl-3
                            ${
                              d.status === "Ready"
                                ? "text-green-600"
                                : d.status === "Issued"
                                ? "text-violet-700"
                                : "text-orange-700"
                            }`}
                        >
                          {d.status}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Admissions Tab */}
          <TabsContent value="admissions">
            <Card>
              <CardHeader>
                <CardTitle>
                  <UserPlus className="h-5 w-5 text-green-700 inline mr-1" />
                  Student Admissions & Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button className="mr-auto bg-red-700 text-white hover:bg-red-800">
                  <Plus className="h-4 w-4 mr-2" /> New Admission
                </Button>
                {/* Here, embed recentAdmissions list/table or <AdmissionForm /> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6">
                  {recentAdmissions.map((a) => (
                    <div
                      key={a.id}
                      className="flex flex-col gap-1 border px-4 py-2 rounded-lg bg-gray-50 border-gray-200"
                    >
                      <span className="text-base font-bold text-red-700">
                        {a.name}
                      </span>
                      <span className="text-xs text-gray-600">
                        Class: <b>{a.class}</b>
                      </span>
                      <span className="text-xs text-gray-500">{a.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fee Tab */}
          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <CardTitle>
                  <CreditCard className="h-5 w-5 text-yellow-700 inline mr-1" />
                  Fee & Payment Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div>
                    <div className="text-lg font-semibold text-green-700">
                      Collected Today:
                    </div>
                    <div className="font-bold text-2xl mb-2">
                      ₹{feeSummary.today.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-700">
                      Pending Fees to Collect:
                    </div>
                    <div className="font-semibold text-orange-700">
                      ₹{feeSummary.pending}
                    </div>
                  </div>
                </div>
                <Progress
                  value={(feeSummary.today / 20000) * 100}
                  className="h-2 mt-4"
                />
                <Button className="mt-4 bg-red-700 text-white hover:bg-red-800">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Collect Fee / Print Receipt
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>
                  <FileBadge2 className="h-5 w-5 text-violet-700 inline mr-1" />
                  Document & Certificate Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-fit border-red-700 text-red-700"
                  >
                    <FileInput className="h-4 w-4 mr-1" />
                    Request New Certificate
                  </Button>
                  <Separator />
                  {documentStatus.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-2 items-center border-b last:border-b-0 py-2"
                    >
                      <FileText className="text-gray-400 h-4 w-4" />
                      <span className="text-md font-bold text-gray-700">
                        {item.type}
                      </span>
                      <span className="text-xs pl-1 text-gray-500">
                        {item.name}
                      </span>
                      <span
                        className={`ml-auto text-xs pl-3
                            ${
                              item.status === "Ready"
                                ? "text-green-600"
                                : item.status === "Issued"
                                ? "text-violet-700"
                                : "text-orange-700"
                            }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Mail className="h-5 w-5 text-orange-700 inline mr-1" />
                  Front Desk Communication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-fit border-red-700 text-red-700 mb-2"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Send Circular/Notice
                  </Button>
                  {/* Replace with real mail/inquiry list */}
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">
                      Today's Emails:
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-mono text-gray-500">
                        info@cvpschool.edu.in{" "}
                        <span className="ml-2 text-green-700 font-medium">
                          [5 New]
                        </span>
                      </div>
                      <div className="text-xs font-mono text-gray-500">
                        principal@cvpschool.edu.in{" "}
                        <span className="ml-2 text-orange-700 font-medium">
                          [2 Pending]
                        </span>
                      </div>
                      <div className="text-xs font-mono text-gray-500">
                        admissions@cvpschool.edu.in{" "}
                        <span className="ml-2 text-green-700">[0]</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
