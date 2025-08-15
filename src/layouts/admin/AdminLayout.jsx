import { AdminSidebar } from "@/components/admin/sidebar/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getAllClasses } from "@/services/class.service";
import { getAllPeriods } from "@/services/periods.service";
import { getAllSchedules } from "@/services/schedule.service";
import { getAllStudents } from "@/services/student.service";
import { getAllSubjects } from "@/services/subject.service";
import { getAllTeachers } from "@/services/teacher.service";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  // FETCH ALL DATA HERE
  const fetchData = async () => {
    try {
      await getAllClasses();
      await getAllSubjects();
      await getAllStudents();
      await getAllTeachers();
      await getAllSchedules();
      await getAllPeriods();
      // await
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 ">
        <SidebarTrigger
          className={
            "p-5 rounded-none bg-red-700 text-white hover:rounded hover:bg-red-700 hover:translate-x-0.5 hover:text-white"
          }
        />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
