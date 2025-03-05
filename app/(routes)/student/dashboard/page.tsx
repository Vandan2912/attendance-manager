// app/student/dashboard/page.tsx
"use client";

import React from "react";
import { Calendar, ChevronRight, Users, Bell, AlertCircle } from "lucide-react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

interface Class {
  id: string;
  name: string;
  teacher: string;
  totalClasses: number;
  attendedClasses: number;
  lastAttendance: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

function App() {
  // Mock data
  const classes: Class[] = [
    {
      id: "1",
      name: "Advanced Mathematics",
      teacher: "Dr. Smith",
      totalClasses: 78,
      attendedClasses: 50,
      lastAttendance: "2024-03-10",
    },
    {
      id: "2",
      name: "Computer Science",
      teacher: "Prof. Johnson",
      totalClasses: 65,
      attendedClasses: 60,
      lastAttendance: "2024-03-11",
    },
    {
      id: "3",
      name: "Physics",
      teacher: "Dr. Brown",
      totalClasses: 70,
      attendedClasses: 45,
      lastAttendance: "2024-03-09",
    },
  ];

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

  const calculateAttendancePercentage = (attended: number, total: number) => {
    return Math.round((attended / total) * 100);
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Classes Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Classes</h2>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {classes.map((classItem) => {
              const attendancePercentage = calculateAttendancePercentage(
                classItem.attendedClasses,
                classItem.totalClasses
              );
              return (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div>
                    <h3 className="font-medium">{classItem.name}</h3>
                    <p className="text-sm text-gray-500">{classItem.teacher}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${getAttendanceColor(attendancePercentage)}`}>
                      {attendancePercentage}%
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
            startDate={new Date("2024-01-01")}
            endDate={new Date("2024-12-31")}
            values={[
              { date: "2024-03-01", count: 1 },
              { date: "2024-03-03", count: 1 },
              { date: "2024-03-05", count: 1 },
              { date: "2024-03-07", count: 1 },
            ]}
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
