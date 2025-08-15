import {
  Bell,
  Book,
  CardSim,
  CheckCheck,
  CopySlash,
  Group,
  Home,
  Inbox,
  LampDesk,
  List,
  Pen,
  PersonStanding,
  Settings,
  User,
} from "lucide-react";

export const schoolMenuItems = [
  {
    title: "Dashboard",
    icon: Home,
    subItems: [],
  },
  {
    title: "Front Desk",
    icon: LampDesk,
    subItems: [
      { title: "Dashboard", url: "/school/front-desk" },
      { title: "Admission", url: "/school/front-desk/admission" },
      // { title: "Teacher", url: "/school/front-desk/teacher" },
      // { title: "Operator", url: "/school/front-desk/operator" },
    ],
  },
  {
    title: "Human Resource",
    icon: PersonStanding,
    subItems: [
      { title: "Dashboard", url: "/school/hr" },
      { title: "Recruit", url: "/school/hr/recruit" },
      // { title: "Teacher", url: "/school/hr/teacher" },
      // { title: "Operator", url: "/school/hr/operator" },
    ],
  },
  {
    title: "User Management",
    icon: User,
    subItems: [
      { title: "Student", url: "/school/students" },
      { title: "Teacher", url: "/school/teachers" },
      { title: "Operator", url: "/school/operators" },
    ],
  },
  {
    title: "Classes",
    icon: Group,
    subItems: [{ title: "List Classes", url: "/school/classes" }],
  },
  {
    title: "Subjects",
    icon: Book,
    subItems: [
      { title: "List Subjects", url: "/school/subjects" },
      // { title: "Date sheet", url: "/school/subjects" },
      // { title: "Results", url: "/school/subjects" },
    ],
  },
  {
    title: "Examination",
    icon: Pen,
    subItems: [
      { title: "Set Examinations", url: "/school/examination/messages" },
      { title: "Date sheet", url: "/school/examination/notifications" },
      { title: "Results", url: "/school/examination/notifications" },
    ],
  },
  {
    title: "Attendance",
    icon: CheckCheck,
    subItems: [
      { title: "Student Attendance", url: "/school/attendance/student" },
      { title: "Teacher Attendance", url: "/school/attendance/teacher" },
    ],
  },
  {
    title: "Schedule",
    icon: List,
    subItems: [{ title: "Current Schedule", url: "/school/schedule" }],
  },
  {
    title: "Fees Management",
    icon: CardSim,
    subItems: [{ title: "Current Schedule", url: "/school/schedule/messages" }],
  },
  {
    title: "Payroll",
    icon: CopySlash,
    subItems: [{ title: "Current Schedule", url: "/school/schedule/messages" }],
  },
  {
    title: "Notices",
    icon: Bell,
    subItems: [{ title: "List Notices", url: "/school/notices/messages" }],
  },
  {
    title: "Settings",
    icon: Settings,
    subItems: [
      { title: "Profile", url: "/school/settings/profile" },
      { title: "Account", url: "/school/settings/account" },
    ],
  },
];
