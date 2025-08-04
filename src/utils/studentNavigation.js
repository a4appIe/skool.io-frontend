import {
  Bell,
  CheckCheck,
  Home,
  List,
  Pen,
  Settings,
} from "lucide-react";

export const studentMenuItems = [
  {
    title: "Dashboard",
    icon: Home,
    subItems: [],
  },
  {
    title: "Attendance",
    icon: CheckCheck,
    subItems: [
      { title: "Student Attendance", url: "/student/attendance/student" },
      { title: "Teacher Attendance", url: "/student/attendance/teacher" },
    ],
  },
  {
    title: "Examination",
    icon: Pen,
    subItems: [
      { title: "Set Examinations", url: "/student/examination/messages" },
      { title: "Date sheet", url: "/student/examination/notifications" },
      { title: "Results", url: "/student/examination/notifications" },
    ],
  },
  {
    title: "Schedule",
    icon: List,
    subItems: [{ title: "Current Schedule", url: "/student/schedule/messages" }],
  },
  {
    title: "Notices",
    icon: Bell,
    subItems: [{ title: "List Notices", url: "/student/notices/messages" }],
  },
  {
    title: "Settings",
    icon: Settings,
    subItems: [
      { title: "Profile", url: "/student/settings/profile" },
      { title: "Account", url: "/student/settings/account" },
    ],
  },
];
