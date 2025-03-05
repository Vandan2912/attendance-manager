"use client";
import React, { useEffect, useState } from "react";
import { Users, Bell, AlertCircle, Plus, UserPlus, Upload, PieChart } from "lucide-react";
import "react-calendar-heatmap/dist/styles.css";

type UserRole = "STUDENT" | "TEACHER";

interface Class {
  id: string;
  name: string;
  teacher: string;
  totalClasses: number;
  attendedClasses: number;
  lastAttendance: string;
  totalStudents?: number;
  attendanceRate?: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  attendanceRate: number;
  lastAttendance: string;
}

function App() {
  const [role, setRole] = useState<UserRole>("STUDENT");

  const [showAddClassModal, setShowAddClassModal] = useState(false);

  // Mock data
  const classes: Class[] = [
    {
      id: "1",
      name: "Advanced Mathematics",
      teacher: "Dr. Smith",
      totalClasses: 78,
      attendedClasses: 50,
      lastAttendance: "2024-03-10",
      totalStudents: 45,
      attendanceRate: 85,
    },
    {
      id: "2",
      name: "Computer Science",
      teacher: "Prof. Johnson",
      totalClasses: 65,
      attendedClasses: 60,
      lastAttendance: "2024-03-11",
      totalStudents: 38,
      attendanceRate: 92,
    },
    {
      id: "3",
      name: "Physics",
      teacher: "Dr. Brown",
      totalClasses: 70,
      attendedClasses: 45,
      lastAttendance: "2024-03-09",
      totalStudents: 42,
      attendanceRate: 78,
    },
  ];

  const students: Student[] = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      attendanceRate: 92,
      lastAttendance: "2024-03-11",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      attendanceRate: 68,
      lastAttendance: "2024-03-10",
    },
    {
      id: "3",
      name: "Carol White",
      email: "carol@example.com",
      attendanceRate: 88,
      lastAttendance: "2024-03-11",
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

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role") as UserRole;
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <div>
      <div className="space-y-6 p-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setShowAddClassModal(true)}
            className="p-4 bg-purple-50 rounded-xl flex items-center gap-3 hover:bg-purple-100 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Create Class</h3>
              <p className="text-sm text-gray-500">Add a new class</p>
            </div>
          </button>

          <button className="p-4 bg-blue-50 rounded-xl flex items-center gap-3 hover:bg-blue-100 transition-colors">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Add Students</h3>
              <p className="text-sm text-gray-500">Enroll new students</p>
            </div>
          </button>

          <button className="p-4 bg-green-50 rounded-xl flex items-center gap-3 hover:bg-green-100 transition-colors">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Upload Resources</h3>
              <p className="text-sm text-gray-500">Share study materials</p>
            </div>
          </button>

          <button className="p-4 bg-orange-50 rounded-xl flex items-center gap-3 hover:bg-orange-100 transition-colors">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Analytics</h3>
              <p className="text-sm text-gray-500">View reports</p>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Classes Overview */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">My Classes</h2>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{classItem.name}</h3>
                    <span className={`text-sm font-semibold ${getAttendanceColor(classItem.attendanceRate || 0)}`}>
                      {classItem.attendanceRate}% attendance
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{classItem.totalStudents} students</span>
                    <span>{classItem.totalClasses} classes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Students */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Students</h2>
              <UserPlus className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
                      alt={student.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                    <span className={`ml-auto text-sm font-semibold ${getAttendanceColor(student.attendanceRate)}`}>
                      {student.attendanceRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Class</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                <input
                  type="text"
                  placeholder="Enter class name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Enter class description"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Create Class
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
