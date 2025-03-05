"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TeacherClass = {
  _id: string;
  name: string;
  students?: any[];
  // For simplicity, we assume the attendance percentage is provided by the API.
  attendancePercentage?: number;
};

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch teacher's classes from the API. In your production code,
    // ensure you obtain the teacher ID from session or a secure JWT.
    async function fetchClasses() {
      try {
        const res = await fetch("/api/teacher/classes");
        const data = await res.json();
        if (res.ok) {
          setClasses(data.classes);
        } else {
          setError(data.error || "Error fetching classes");
        }
      } catch (err) {
        setError("Error fetching classes");
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Teacher Dashboard</h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Your Classes</h2>
        <Link href="/teacher/class/create">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create New Class</button>
        </Link>
      </div>
      {loading ? (
        <p>Loading classes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : classes.length === 0 ? (
        <p>No classes found. Start by creating a new class.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((cls) => (
            <div key={cls._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-medium mb-2">{cls.name}</h3>
              <p>Total Students: {cls.students ? cls.students.length : 0}</p>
              <p>Attendance: {cls.attendancePercentage !== undefined ? cls.attendancePercentage.toFixed(2) : "N/A"}%</p>
              <div className="flex mt-4 space-x-2">
                <Link href={`/teacher/class/${cls._id}`}>
                  <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">View Details</button>
                </Link>
                <Link href={`/teacher/class/${cls._id}/announcement`}>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Announcements</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
