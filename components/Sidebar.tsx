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
import { url } from "inspector";

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
          { icon: Calendar, label: "Attendance", id: "attendance" },
          { icon: MessageSquare, label: "Announcements", id: "announcements", url: "/teacher/announcements" },
          { icon: User, label: "Profile", id: "profile", url: "/teacher/profile" },
        ]
      : [
          { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", url: "/student/dashboard" },
          { icon: BookOpen, label: "My Classes", id: "classes", url: "/student/classes" },
          { icon: Calendar, label: "Attendance", id: "attendance" },
          { icon: MessageSquare, label: "Announcements", id: "announcements", url: "/student/announcements" },
          { icon: User, label: "Profile", id: "profile", url: "/student/profile" },
        ];

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role") as UserRole;
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          {role === "STUDENT" ? (
            <GraduationCap className="w-8 h-8 text-purple-600" />
          ) : (
            <School className="w-8 h-8 text-purple-600" />
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
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 w-64 p-4 border-t">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
