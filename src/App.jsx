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
import AdminHR from "./pages/admin/AdminHR";
import AdminHRDashboard from "./pages/admin/admin-human-resource/AdminHRDashboard";
import AdminHRRecruit from "./pages/admin/admin-human-resource/AdminHRRecruit";
import { AdminTeacherProfile } from "./pages/admin/AdminTeacherProfile";
import AttendanceDetails from "./pages/admin/attendance/AttendanceDetails";
import AdminStudentAttendance from "./pages/admin/attendance/AdminStudentAttendance";
import AdminTeacherAttendance from "./pages/admin/attendance/AdminTeacherAttendance";
import AdminFees from "./pages/admin/AdminFees";
import AdminPayrollDetails from "./pages/admin/admin-payroll/AdminPayrollDetails";
import AdminPayrollList from "./pages/admin/admin-payroll/AdminPayrollList";
import AdminPayroll from "./pages/admin/AdminPayroll";
import AdminSalary from "./pages/admin/admin-payroll/AdminSalary";
import AdminOperators from "./pages/admin/AdminOperators";
import AdminExaminationDetails from "./components/admin/examination/AdminExaminationDetails";
import AdminFeesList from "./pages/admin/admin-fees/AdminFeesList";

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
        <Route path="attendance" element={<AdminAttendance />}>
          <Route path="student" element={<AdminStudentAttendance />} />
          <Route path="teacher" element={<AdminTeacherAttendance />} />
          <Route path=":type/details/:id" element={<AttendanceDetails />} />
        </Route>
        <Route path="classes" element={<AdminClasses />} />
        {/* <Route path="examinations" element={<AdminExaminations />} /> */}
        <Route path="notices" element={<AdminNotices />} />
        <Route path="schedule" element={<AdminSchedule />} />
        <Route path="students">
          <Route index element={<AdminStudents />} />
          <Route path="profile/:studentId" element={<AdminStudentProfile />} />
        </Route>
        <Route path="subjects" element={<AdminSubjects />} />
        <Route path="teachers">
          <Route index element={<AdminTeachers />} />
          <Route path="profile/:teacherId" element={<AdminTeacherProfile />} />
        </Route>
        <Route path="operators" element={<AdminOperators />} />
        <Route path="front-desk" element={<AdminFrontDesk />}>
          <Route index element={<AdminFrontDeskDashboard />} />
          <Route path="admission" element={<AdminAdmission edit={false} />} />
          <Route
            path="edit-student/:studentId"
            element={<AdminAdmission edit={true} />}
          />
        </Route>
        <Route path="hr" element={<AdminHR />}>
          <Route index element={<AdminHRDashboard />} />
          <Route path="recruit" element={<AdminHRRecruit />} />
          <Route
            path="edit-teacher/:teacherId"
            element={<AdminHRRecruit edit={true} />}
          />
        </Route>
        <Route path="payroll" element={<AdminPayroll />}>
          <Route index element={<AdminPayrollList />} />
          <Route path="details/:teacherId" element={<AdminPayrollDetails />} />
          <Route path="salaries" element={<AdminSalary />} />
        </Route>
        <Route path="fees" element={<AdminFees />}>
          <Route index element={<AdminFeesList />} />
          {/* <Route path="details/:teacherId" element={<AdminPayrollDetails />} /> */}
          {/* <Route path="salaries" element={<AdminSalary />} /> */}
        </Route>
        <Route path="examinations">
          <Route index element={<AdminExaminations />} />
          <Route path=":examId" element={<AdminExaminationDetails />} />
        </Route>
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
      </Route>

      {/* Super Admin Routes */}
      <Route path="/admin" element={<SuperAdminDashboard />}>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="add" element={<AddSchool />} />
      </Route>
    </Routes>
  </>
);

export default App;
