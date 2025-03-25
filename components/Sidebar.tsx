"use client";
import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  School,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

type UserRole = "STUDENT" | "TEACHER";

const Sidebar = () => {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [activeTab, setActiveTab] = useState("dashboard");

  const sidebarItems =
    role === "TEACHER"
      ? [
          { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", url: "/teacher/dashboard" },
          { icon: BookOpen, label: "My Classes", id: "classes", url: "/teacher/classes" },
          { icon: Users, label: "Students", id: "students", url: "/teacher/students" },
          // { icon: Calendar, label: "Attendance", id: "attendance", url: "/teacher/attendance" },
          { icon: Calendar, label: "Attendance", id: "attendance", url: "/teacher/attend" },
          { icon: MessageSquare, label: "Announcements", id: "announcements", url: "/teacher/announcements" },
          // { icon: User, label: "Profile", id: "profile", url: "/teacher/profile" },
        ]
      : [
          { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", url: "/student/dashboard" },
          { icon: BookOpen, label: "My Classes", id: "classes", url: "/student/classes" },
          // { icon: Calendar, label: "Attendance", id: "attendance" },
          { icon: MessageSquare, label: "Announcements", id: "announcements", url: "/student/announcements" },
          { icon: User, label: "Profile", id: "profile", url: "/student/profile" },
        ];

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // Redirect to login page
    router.push("/login");
  };

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role") as UserRole;
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <div className="bg-white shadow-lg w-64">
      <div className="p-6 fixed top-0">
        <div className="flex gap-2 items-center mb-8">
          {role === "STUDENT" ? (
            <GraduationCap className="h-8 text-purple-600 w-8" />
          ) : (
            <School className="h-8 text-purple-600 w-8" />
          )}
          <h1 className="text-xl font-bold">SASSC</h1>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.url) {
                  router.push(item.url);
                }
                setActiveTab(item.id);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id ? "bg-purple-50 text-purple-600" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="border-t p-4 w-64 bottom-0 fixed">
        <button
          className="flex rounded-lg text-gray-600 w-full gap-3 hover:bg-gray-50 items-center px-4 py-3 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
