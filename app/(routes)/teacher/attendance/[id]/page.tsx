"use client";
import WebcamFeed from "@/components/WebcamFeed";
import React from "react";

const StartAttendancePortal: React.FC = () => {
  const startAttendanceSystem = async () => {
    const response = await fetch("/api/attendance/mark");
    if (response.ok) {
      alert("Attendance portal started");
    } else {
      alert("Failed to start attendance portal");
    }
  };

  return (
    <div className="space-y-6 p-8">
      <WebcamFeed />
    </div>
  );
};

export default StartAttendancePortal;
