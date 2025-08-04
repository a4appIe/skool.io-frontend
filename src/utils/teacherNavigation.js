import {
  Bell,
  Book,
  CheckCheck,
  Group,
  Home,
  List,
  Pen,
  Settings,
  User,
} from "lucide-react";

export const teacherMenuItems = [
  {
    title: "Dashboard",
    icon: Home,
    subItems: [],
  },
  {
    title: "Attendance",
    icon: CheckCheck,
    subItems: [
      { title: "Student Attendance", url: "/teacher/attendance/student" },
      { title: "Teacher Attendance", url: "/teacher/attendance/teacher" },
    ],
  },
  {
    title: "Examination",
    icon: Pen,
    subItems: [
      { title: "Set Examinations", url: "/teacher/examination/messages" },
      { title: "Date sheet", url: "/teacher/examination/notifications" },
      { title: "Results", url: "/teacher/examination/notifications" },
    ],
  },
  {
    title: "Schedule",
    icon: List,
    subItems: [{ title: "Current Schedule", url: "/teacher/schedule/messages" }],
  },
  {
    title: "Notices",
    icon: Bell,
    subItems: [{ title: "List Notices", url: "/teacher/notices/messages" }],
  },
  {
    title: "Settings",
    icon: Settings,
    subItems: [
      { title: "Profile", url: "/teacher/settings/profile" },
      { title: "Account", url: "/teacher/settings/account" },
    ],
  },
];
