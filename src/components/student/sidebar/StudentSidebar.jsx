import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { teacherMenuItems } from "@/utils/teacherNavigation";

export function StudentSidebar() {
  const [openItem, setOpenItem] = useState(null);
  const location = useLocation();

  const toggleItem = (index) => {
    setOpenItem((prev) => (prev === index ? null : index));
  };

  // Check if current path matches exactly (for Dashboard)
  const isExactPath = (path) => {
    if (path === "/student") {
      return location.pathname === path || location.pathname === "/student/";
    }
  };

  // Check if current path starts with the path (for sub-items)
  const isPathActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <Sidebar className="w-64 h-screen bg-white border-r border-gray-200">
      <SidebarHeader className="py-8 px-6 bg-red-700 border-b border-red-800">
        <h1 className="text-2xl font-bold text-white text-center">
          Hello, Teacher
        </h1>
      </SidebarHeader>

      <SidebarContent className="p-3 bg-white">
        <SidebarMenu className="space-y-1">
          {teacherMenuItems.map((item, index) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;

            // Fixed active state logic
            const isActive = hasSubItems
              ? item.subItems.some((subItem) => isPathActive(subItem.url))
              : isExactPath("/student"); // Only exact match for Dashboard

            const isOpen = openItem === index;

            return (
              <Collapsible
                key={index}
                open={isOpen}
                onOpenChange={() => toggleItem(index)}
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuItem>
                    {/* If item has no sub-items (Dashboard), wrap in Link */}
                    {!hasSubItems ? (
                      <Link to="/student" className="block">
                        <SidebarMenuButton
                          className={`cursor-pointer group flex items-center justify-between w-full px-4 py-3 text-gray-700 rounded-lg border-l-4 transition-all duration-200 ease-in-out hover:bg-gray-50 hover:border-gray-500 hover:text-gray-900 focus-visible:bg-gray-50 focus-visible:border-red-700 focus-visible:text-gray-900
                            ${
                              isActive
                                ? "bg-red-50 border-red-700 text-gray-900"
                                : "border-transparent"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon
                              className={`h-5 w-5 transition-colors duration-200 ${
                                isActive
                                  ? "text-red-700"
                                  : "text-gray-600 group-hover:text-red-700"
                              }`}
                            />
                            <span className="font-medium text-sm">
                              {item.title}
                            </span>
                          </div>
                        </SidebarMenuButton>
                      </Link>
                    ) : (
                      <SidebarMenuButton
                        className={`cursor-pointer group flex items-center justify-between w-full px-4 py-3 text-gray-700 rounded-lg border-l-4 transition-all duration-200 ease-in-out hover:bg-gray-50 hover:border-gray-500 hover:text-gray-900 focus-visible:bg-gray-50 focus-visible:border-red-700 focus-visible:text-gray-900
                          ${
                            isActive
                              ? "bg-red-50 border-red-700 text-gray-900"
                              : "border-transparent"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon
                            className={`h-5 w-5 transition-colors duration-200 ${
                              isActive
                                ? "text-red-700"
                                : "text-gray-600 group-hover:text-red-700"
                            }`}
                          />
                          <span className="font-medium text-sm">
                            {item.title}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-all duration-200 ${
                            isActive
                              ? "text-red-700"
                              : "text-gray-500 group-hover:text-red-700"
                          } ${isOpen ? "rotate-180" : "rotate-0"}`}
                        />
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </CollapsibleTrigger>

                {hasSubItems && (
                  <CollapsibleContent className="transition-all duration-200 ease-in-out">
                    <SidebarMenuSub className="ml-8 mt-1 space-y-1 pb-2">
                      {item.subItems.map((subItem, subIndex) => {
                        const isSubActive = isPathActive(subItem.url);

                        return (
                          <SidebarMenuSubItem key={subIndex}>
                            <Link to={subItem.url} className="block">
                              <div
                                className={`px-4 py-2.5 text-sm rounded-md transition-all duration-200 ease-in-out hover:bg-gray-100 hover:text-gray-900 hover:translate-x-1
                                  ${
                                    isSubActive
                                      ? "bg-red-50 text-red-700 border-l-2 border-red-700"
                                      : "text-gray-600"
                                  }
                                `}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                                      isSubActive ? "bg-red-700" : "bg-gray-400"
                                    }`}
                                  ></div>
                                  {subItem.title}
                                </div>
                              </div>
                            </Link>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-white border-t border-gray-200">
        <div className="text-center mb-3">
          <span className="text-sm font-medium text-gray-700">
            Teacher Panel
          </span>
          <span className="block text-xs text-red-700 font-semibold">v1.0</span>
        </div>
        <Button
          variant="outline"
          className="w-full border-red-700 text-red-700 hover:bg-red-700 hover:text-white transition-all duration-200 font-medium"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
