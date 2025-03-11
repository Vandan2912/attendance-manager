// app/student/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Calendar, ChevronRight, Users, Bell, AlertCircle } from "lucide-react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
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
  recentAttendanceRecords: { _id: string }[];
  // students?: Student[];
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

interface HeatMap {
  date: string;
  count: number;
}

function App() {
  const router = useRouter();
  const [Loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [user, setUser] = useState<any>();
  const [heatmaparray, setheatmaparray] = useState<HeatMap[]>([]);

  const getClasses = async () => {
    try {
      setLoading(true);
      const user = sessionStorage.getItem("user");
      const userObj = JSON.parse(user!);
      const res = await fetch(`/api/student/classes?studentId=${userObj._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setClasses(data.classes);
      // Merge all recentAttendanceRecords
      const mergedAttendance = data.classes
        .flatMap((classItem: Class) => classItem.recentAttendanceRecords)
        .reduce((acc: any, record: any) => {
          const existing = acc.find((item: any) => item.date === record.date);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ date: record.date, count: 1 });
          }
          return acc;
        }, []);

      // Sort the array by date (optional)
      mergedAttendance.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

      console.log("values=", mergedAttendance);
      setheatmaparray(mergedAttendance ?? []);
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

  const announcements: Announcement[] = [
    {
      id: "1",
      title: "Mid-term Examination Schedule",
      content: "The mid-term examinations will begin from March 20th. Please check the detailed schedule.",
      date: "2024-03-10",
      author: "Academic Office",
    },
    {
      id: "2",
      title: "Workshop on Machine Learning",
      content: "A workshop on ML basics will be conducted this weekend.",
      date: "2024-03-09",
      author: "Prof. Johnson",
    },
  ];

  const getAttendanceColor = (percentage: number) => {
    if (percentage < 75) return "text-red-500";
    if (percentage < 85) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="p-8">
      {Loading && <Loader />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Classes Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Classes</h2>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {classes?.map((classItem) => {
              return (
                <div
                  key={classItem._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => {
                    router.push(`/student/classes/${classItem._id}`);
                  }}
                >
                  <div>
                    <h3 className="font-medium">{classItem.name}</h3>
                    <p className="text-sm text-gray-500">{classItem.teacher}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${getAttendanceColor(Number(classItem.attendanceRate))}`}>
                      {classItem.attendanceRate}%
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance Calendar */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Attendance Overview</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <CalendarHeatmap
            startDate={new Date("2025-01-01")}
            endDate={new Date("2025-12-31")}
            values={heatmaparray}
            classForValue={(value) => {
              if (!value) return "color-empty";
              return `color-scale-${value.count}`;
            }}
          />
        </div>

        {/* Announcements */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Announcements</h2>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">{announcement.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{announcement.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span>{announcement.author}</span>
                      <span>•</span>
                      <span>{announcement.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
