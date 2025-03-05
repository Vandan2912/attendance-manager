"use client";
import { Bell, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
type UserRole = "STUDENT" | "TEACHER";
type User = {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  faceData: string;
};

const Header = () => {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [user, setUser] = useState<User>({
    _id: "",
    email: "",
    name: "",
    role: "STUDENT",
    faceData: "",
  });
  useEffect(() => {
    const storedRole = sessionStorage.getItem("role") as UserRole;
    if (storedRole) {
      setRole(storedRole);
    }

    const storedUser = sessionStorage.getItem("user") as UserRole;
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3">
            <img src={user?.faceData ?? ""} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-medium">{user?.name ?? ""}</p>
              <p className="text-sm text-gray-500 capitalize">{role ?? ""}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
