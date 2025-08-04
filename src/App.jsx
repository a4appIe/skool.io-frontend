import { Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/public/PublicLayout";
import AdminLayout from "./layouts/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminExaminations from "./pages/admin/AdminExaminations";
import AdminNotices from "./pages/admin/AdminNotices";
import AdminSchedule from "./pages/admin/AdminSchedule";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminSubjects from "./pages/admin/AdminSubjects";
import AdminTeachers from "./pages/admin/AdminTeachers";
import TeacherLayout from "./layouts/teacher/TeacherLayout";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherExaminations from "./pages/teacher/TeacherExaminations";
import TeacherSchedule from "./pages/teacher/TeacherSchedule";
import TeacherNotices from "./pages/teacher/TeacherNotices";
import StudentLayout from "./layouts/student/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentExaminations from "./pages/student/StudentExaminations";
import StudentSchedule from "./pages/student/StudentSchedule";
import StudentNotices from "./pages/student/StudentNotices";
import { AddSchool } from "./pages/super_admin/AddSchool";
import SuperAdminDashboard from "./pages/super_admin/SuperAdminDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AdminFrontDeskDashboard } from "./pages/admin/admin-front-desk/AdminFrontDeskDashboard";
import AdminAdmission from "./pages/admin/admin-front-desk/AdminAdmission";
import AdminFrontDesk from "./pages/admin/AdminFrontDesk";
import { AdminStudentProfile } from "./pages/admin/AdminStudentProfile";

const App = () => (
  <>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}></Route>
      {/* Admin Routes */}
      <Route
        path="/school"
        element={
          <ProtectedRoute roles={["SCHOOL"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="examinations" element={<AdminExaminations />} />
        <Route path="notices" element={<AdminNotices />} />
        <Route path="schedule" element={<AdminSchedule />} />
        <Route path="students">
          <Route index element={<AdminStudents />} />
          <Route path="profile/:studentId" element={<AdminStudentProfile />} />
        </Route>
        <Route path="subjects" element={<AdminSubjects />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="front-desk" element={<AdminFrontDesk />}>
          {/* Add more front desk related routes here */}
          <Route index element={<AdminFrontDeskDashboard />} />
          <Route path="admission" element={<AdminAdmission edit={false} />} />
          <Route
            path="edit-student/:studentId"
            element={<AdminAdmission edit={true} />}
          />
        </Route>
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
      {/* Teacher Routes */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute roles={["TEACHER"]}>
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="examinations" element={<TeacherExaminations />} />
        <Route path="schedule" element={<TeacherSchedule />} />
        <Route path="notices" element={<TeacherNotices />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute roles={["STUDENT"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="examinations" element={<StudentExaminations />} />
        <Route path="schedule" element={<StudentSchedule />} />
        <Route path="notices" element={<StudentNotices />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
      {/* Super Admin Routes */}
      <Route path="/admin" element={<SuperAdminDashboard />}>
        <Route index element={<SuperAdminDashboard />} />
        {/* <Route path="attendance" element={<StudentAttendance />} />
        <Route path="examinations" element={<StudentExaminations />} />
        <Route path="schedule" element={<StudentSchedule />} />
        <Route path="notices" element={<StudentNotices />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
      {/* Add more routes as needed */}
      <Route path="/add" element={<AddSchool />} />
    </Routes>
  </>
);

export default App;
