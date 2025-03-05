"use client";
import React, { useState } from "react";
import { ChevronRight, Plus, UserPlus, Upload, X, Trash2, Download } from "lucide-react";

interface Class {
  id: string;
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

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

const page = () => {
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showClassDetailModal, setShowClassDetailModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

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
      description: "Advanced topics in calculus, linear algebra, and differential equations.",
      students: [
        {
          id: "1",
          name: "Alice Johnson",
          email: "alice@example.com",
          attendanceRate: 92,
          lastAttendance: "2024-03-11",
          enrollmentDate: "2024-01-15",
        },
        {
          id: "2",
          name: "Bob Smith",
          email: "bob@example.com",
          attendanceRate: 68,
          lastAttendance: "2024-03-10",
          enrollmentDate: "2024-01-15",
        },
      ],
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
      description: "Introduction to programming concepts and algorithms.",
      students: [
        {
          id: "3",
          name: "Carol White",
          email: "carol@example.com",
          attendanceRate: 88,
          lastAttendance: "2024-03-11",
          enrollmentDate: "2024-01-20",
        },
      ],
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
      description: "Fundamentals of mechanics and thermodynamics.",
      students: [],
    },
  ];

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Classes</h1>
        <button
          onClick={() => setShowAddClassModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedClass(classItem);
              setShowClassDetailModal(true);
            }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{classItem.name}</h3>
                  <p className="text-sm text-gray-500">{classItem.teacher}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    classItem.attendanceRate! >= 85
                      ? "bg-green-100 text-green-800"
                      : classItem.attendanceRate! >= 75
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {classItem.attendanceRate}% Attendance
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total Students</span>
                  <span className="font-medium">{classItem.totalStudents}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total Classes</span>
                  <span className="font-medium">{classItem.totalClasses}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last Active</span>
                  <span className="font-medium">{classItem.lastAttendance}</span>
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

      {/* Class Detail Modal */}
      {showClassDetailModal && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 -top-6">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">{selectedClass.name}</h2>
              <button
                onClick={() => setShowClassDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-500 mb-1">Total Students</h4>
                  <p className="text-2xl font-bold text-purple-600">{selectedClass.totalStudents}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-500 mb-1">Total Classes</h4>
                  <p className="text-2xl font-bold text-blue-600">{selectedClass.totalClasses}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-500 mb-1">Attendance Rate</h4>
                  <p className="text-2xl font-bold text-green-600">{selectedClass.attendanceRate}%</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Students</h3>
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    Add Student
                  </button>
                </div>
                <div className="bg-white rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Attendance
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Active
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedClass.students?.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    student.name
                                  )}&background=random`}
                                  alt={student.name}
                                  className="w-8 h-8 rounded-full mr-3"
                                />
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  student.attendanceRate >= 85
                                    ? "bg-green-100 text-green-800"
                                    : student.attendanceRate >= 75
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {student.attendanceRate}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.lastAttendance}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Class Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <div className="text-left">
                      <h4 className="font-medium">Upload Materials</h4>
                      <p className="text-sm text-gray-500">Share study resources</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Download className="w-5 h-5 text-gray-500" />
                    <div className="text-left">
                      <h4 className="font-medium">Download Reports</h4>
                      <p className="text-sm text-gray-500">Get attendance reports</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Add New Student</h2>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  placeholder="Enter student name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Add Student
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
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
};

export default page;
