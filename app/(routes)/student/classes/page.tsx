"use client";
import React from "react";
import { useRouter } from "next/navigation";

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

const page = () => {
  const router = useRouter();

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
      attendanceRate: 50,
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              router.push("/student/classes/math");
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
