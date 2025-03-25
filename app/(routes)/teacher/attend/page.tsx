"use client";
import React, { useEffect, useState } from "react";
import { ChevronRight, Plus, UserPlus, Upload, X, Trash2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

interface Class {
  _id: string;
  name: string;
  teacher: string;
  totalClasses: number;
  attendedClasses: number;
  lastAttendance: string;
  totalStudents?: number;
  attendanceRate?: number;
  description?: string;
  students?: Student[];
}

interface Student {
  id: string;
  name: string;
  email: string;
  attendanceRate: number;
  lastAttendance: string;
  enrollmentDate?: string;
}

const page = () => {
  const [Loading, setLoading] = useState(false);
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [user, setUser] = useState<any>();

  const getClasses = async () => {
    try {
      setLoading(true);
      const user = sessionStorage.getItem("user");
      let teacherId = "";
      if (user) {
        const userObj = JSON.parse(user);
        teacherId = userObj._id;
      }
      const res = await fetch(`/api/teacher/classes`, {
        method: "GET",
        headers: { "Content-Type": "application/json", teacherId },
      });

      const data = await res.json();
      setClasses(data.classes);
      if (!res.ok) {
        throw new Error(data.error || "Failed to create class");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      setUser(userObj);
    }
    getClasses();
  }, []);

  return (
    <div className="space-y-6 p-8">
      {Loading && <Loader />}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Classes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div
            key={classItem._id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              router.push(`/teacher/attend/${classItem._id}`);
            }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{classItem.name}</h3>
                  <p className="text-sm text-gray-500">{classItem.teacher}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
              <span className="text-sm text-gray-600">Click to manage class</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
