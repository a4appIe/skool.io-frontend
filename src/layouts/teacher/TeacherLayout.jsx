import { TeacherSidebar } from "@/components/teacher/sidebar/TeacherSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function TeacherLayout() {
  return (
    <SidebarProvider>
      <TeacherSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <SidebarTrigger className={"p-5 rounded-none bg-red-700 text-white"} />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
