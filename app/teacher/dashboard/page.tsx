// app/teacher/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // Replace with API call to fetch teacher’s classes.
    const fetchClasses = async () => {
      const res = await fetch("/api/classes"); // Create a GET endpoint for classes if needed.
      const data = await res.json();
      setClasses(data.classes || []);
    };
    fetchClasses();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Teacher Dashboard</h2>
      <h3>Your Classes</h3>
      {classes.length === 0 ? (
        <p>No classes created yet.</p>
      ) : (
        <ul>
          {classes.map((cls: any) => (
            <li key={cls.id}>
              {cls.name} - <a href={`/teacher/class/${cls.id}`}>View Details</a>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => (window.location.href = "/teacher/class/create")}>Create New Class</button>
    </div>
  );
}
