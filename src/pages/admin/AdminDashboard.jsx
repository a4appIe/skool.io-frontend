import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  UserPlus,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  FileText,
  Settings,
  Calendar,
  DollarSign,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  SearchSlashIcon,
  IndianRupee,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getSchool } from "@/services/school.service";
import { useEffect, useState } from "react";
import AdminEditSession from "@/components/admin/dashboard/AdminEditSession";
import AdminCreateSession from "@/components/admin/dashboard/AdminCreateSession";
import AdminViewSession from "@/components/admin/dashboard/AdminViewSession";
import { getAllSessions, updateSession } from "@/services/session.service";

export function AdminDashboard() {
  const [school, setSchool] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchSessions() {
    setLoading(true);
    let fetchedSessions = await getAllSessions();
    console.log("Sessions", fetchedSessions);
    if (fetchedSessions) {
      setSessions(fetchedSessions);
    }
    setLoading(false);
  }

  // Quick Actions Data
  const quickActions = [
    {
      title: "Add Student",
      description: "Register new student",
      icon: UserPlus,
      color: "bg-red-700 hover:bg-red-800",
      action: "add-student",
    },
    {
      title: "Create Class",
      description: "Setup new class",
      icon: Plus,
      color: "bg-gray-700 hover:bg-gray-800",
      action: "create-class",
    },
    {
      title: "Schedule Event",
      description: "Add to calendar",
      icon: Calendar,
      color: "bg-red-600 hover:bg-red-700",
      action: "schedule-event",
    },
    {
      title: "Generate Report",
      description: "Create reports",
      icon: FileText,
      color: "bg-gray-600 hover:bg-gray-700",
      action: "generate-report",
    },
    {
      title: "Manage Fees",
      description: "Payment handling",
      icon: IndianRupee,
      color: "bg-red-700 hover:bg-red-800",
      action: "manage-fees",
    },
    {
      title: "Session",
      description: "Create/Update session",
      icon: SearchSlashIcon,
      color: "bg-gray-700 hover:bg-gray-800",
      action: "view-analytics",
    },
  ];

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      title: "New student registration",
      description: "John Doe registered for Grade 10",
      time: "2 hours ago",
      icon: UserPlus,
      type: "success",
    },
    {
      id: 2,
      title: "Fee payment received",
      description: "Payment of $500 from Alice Smith",
      time: "4 hours ago",
      icon: DollarSign,
      type: "success",
    },
    {
      id: 3,
      title: "Teacher leave request",
      description: "Ms. Johnson requested leave",
      time: "6 hours ago",
      icon: Clock,
      type: "warning",
    },
    {
      id: 4,
      title: "System maintenance",
      description: "Scheduled maintenance completed",
      time: "1 day ago",
      icon: Settings,
      type: "info",
    },
  ];

  // Upcoming Events
  const upcomingEvents = [
    {
      id: 1,
      title: "Parent-Teacher Meeting",
      date: "July 25, 2025",
      time: "10:00 AM",
      type: "meeting",
    },
    {
      id: 2,
      title: "Science Fair",
      date: "July 28, 2025",
      time: "2:00 PM",
      type: "event",
    },
    {
      id: 3,
      title: "Monthly Assessment",
      date: "August 1, 2025",
      time: "9:00 AM",
      type: "exam",
    },
  ];

  const handleQuickAction = (action) => {
    console.log(`Executing action: ${action}`);
    // Implement your action handlers here
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertCircle;
      case "info":
        return Activity;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };
  const totalUsers = school?.stats?.totalUsers;
  const userData = [
    {
      name: "Students",
      value: school?.stats?.totalStudents,
      color: "#2563eb",
      icon: BookOpen,
      percentage: (
        (school?.stats?.totalStudents / (school?.stats?.totalUsers - 1)) *
        100
      ).toFixed(2),
    },
    {
      name: "Teachers",
      value: school?.stats?.totalTeachers,
      color: "#dc2626",
      icon: GraduationCap,
      percentage: (
        (school?.stats?.totalTeachers / (school?.stats?.totalUsers - 1)) *
        100
      ).toFixed(2),
    },
  ];

  async function getSchoolData() {
    let school = await getSchool();
    setSchool(school);
    console.log(school);
  }

  async function handleEditSession(session) {
    try {
      // Trigger parent handler for session update
      let updatedSchool = await updateSession({ session });
      setSchool(updatedSchool);
    } catch (err) {
      console.log(err);
    }
  }

  // Custom tooltip
  // const CustomTooltip = ({ active, payload }) => {
  //   if (active && payload && payload.length) {
  //     const data = payload[0].payload;
  //     return (
  //       <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
  //         <div className="flex items-center gap-2 mb-1">
  //           <div
  //             className="w-3 h-3 rounded-full"
  //             style={{ backgroundColor: data.color }}
  //           ></div>
  //           <p className="font-semibold text-gray-900">{data.name}</p>
  //         </div>
  //         <p className="text-sm text-gray-600">
  //           Count: {data.value.toLocaleString()}
  //         </p>
  //         <p className="text-sm text-gray-600">
  //           Percentage: {data.percentage}%
  //         </p>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  useEffect(() => {
    getSchoolData();
  }, []);

  // Stats Data
  const statsData = [
    {
      title: "Total Students",
      value: school?.stats?.totalStudents,
      change: "+12%",
      changeType: "increase",
      icon: Users,
      description: "Active students",
      progress: 85,
    },
    {
      title: "Total Teachers",
      value: school?.stats?.totalTeachers,
      change: "+5%",
      changeType: "increase",
      icon: GraduationCap,
      description: "Faculty members",
      progress: 92,
    },
    {
      title: "Active Classes",
      value: school?.stats?.totalClasses,
      change: "+8%",
      changeType: "increase",
      icon: BookOpen,
      description: "Running classes",
      progress: 78,
    },
    {
      title: "Monthly Revenue",
      value: "$47,290",
      change: "-3%",
      changeType: "decrease",
      icon: DollarSign,
      description: "This month",
      progress: 65,
    },
  ];

  return (
    <div className="flex-1 min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="w-full h-full">
        <div className="px-6 py-4 md:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Welcome back! Here's what's happening at your school.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="border-red-700 text-red-700 flex-1"
                >
                  Session: <span className="font-bold">{school?.session}</span>
                  <AdminEditSession
                    sessions={sessions}
                    loading={loading}
                    session={school?.session}
                    handleEditSession={handleEditSession}
                  />
                </Badge>
                <div className="flex items-center flex-1 gap-2">
                  <AdminCreateSession />
                  <AdminViewSession
                    fetchSessions={fetchSessions}
                    sessions={sessions}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-red-700 group"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <CardContent className="p-4 text-center">
                      <div
                        className={`inline-flex p-3 rounded-lg text-white mb-3 ${action.color} group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-medium text-sm text-gray-900 mb-1">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Stats and Chart Section */}
          <div className="grid lg:grid-cols-5 gap-6 mb-8">
            {/* Stats Cards - Left Side */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {statsData.map((stat, index) => {
                  const Icon = stat.icon;
                  const TrendIcon =
                    stat.changeType === "increase" ? TrendingUp : TrendingDown;

                  return (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-shadow duration-200 border-gray-200"
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </CardTitle>
                        <Icon className="h-5 w-5 text-red-700" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {stat.value}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                          <div className="flex items-center">
                            <TrendIcon
                              className={`h-3 w-3 mr-1 ${
                                stat.changeType === "increase"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            />
                            <span
                              className={
                                stat.changeType === "increase"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {stat.change}
                            </span>
                            <span className="ml-1">from last month</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{stat.description}</span>
                            <span>{stat.progress}%</span>
                          </div>
                          <Progress value={stat.progress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Chart - Right Side */}
            <div className="lg:col-span-2">
              <Card className="h-full border-gray-200">
                {/* Header */}
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-4">
                    <Users className="h-4 w-4 text-gray-600" />{" "}
                    <span>
                      {" "}
                      Total Users -{" "}
                      <span className="text-red-600 font-bold">
                        {totalUsers}
                      </span>
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Total system users breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Recharts Pie Chart */}
                  <div className="w-full h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={90}
                          innerRadius={40}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {userData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between px-3 py-2 rounded-lg border-2"
                          style={{
                            backgroundColor: `${item.color}10`,
                            borderColor: `${item.color}30`,
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="p-2 rounded-full"
                              style={{ backgroundColor: `${item.color}20` }}
                            >
                              <Icon
                                className="h-5 w-5"
                                style={{ color: item.color }}
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {item.percentage}% of total
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className="text-2xl font-bold"
                              style={{ color: item.color }}
                            >
                              {item.value}
                            </div>
                            <div className="text-xs text-gray-500">users</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Activities</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-700 hover:text-red-800"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    const ActivityIcon = getActivityIcon(activity.type);
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div
                          className={`p-2 rounded-full bg-gray-100 ${getActivityColor(
                            activity.type
                          )}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                        <ActivityIcon
                          className={`h-4 w-4 ${getActivityColor(
                            activity.type
                          )}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Your schedule for the next week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-red-700 transition-colors duration-200"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-700"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {event.date} at {event.time}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-red-700 hover:bg-red-800 text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Full Calendar
                </Button>
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Key metrics this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Attendance Rate</span>
                      <span className="font-medium text-gray-900">94.2%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fee Collection</span>
                      <span className="font-medium text-gray-900">87.5%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Academic Performance
                      </span>
                      <span className="font-medium text-gray-900">91.8%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Parent Engagement</span>
                      <span className="font-medium text-gray-900">78.3%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-red-700 mr-2" />
                    <span className="text-sm font-medium text-red-700">
                      Overall improvement of 12% this quarter
                    </span>
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
