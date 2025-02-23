// app/student/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // Replace with an API call to fetch student’s classes and attendance info.
    const fetchClasses = async () => {
      const res = await fetch("/api/student/classes"); // Endpoint you need to create.
      const data = await res.json();
      setClasses(data.classes || []);
    };
    fetchClasses();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Student Dashboard</h2>
      <h3>Your Classes and Attendance</h3>
      {classes.length === 0 ? (
        <p>No enrolled classes found.</p>
      ) : (
        <ul>
          {classes.map((cls: any) => {
            const percentage = (cls.attended / cls.total) * 100;
            return (
              <li key={cls.id} style={{ color: percentage < 75 ? "red" : "black" }}>
                {cls.name} — {cls.attended}/{cls.total} ({percentage.toFixed(2)}%){" "}
                <a href={`/student/class/${cls.id}`}>View Details</a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
