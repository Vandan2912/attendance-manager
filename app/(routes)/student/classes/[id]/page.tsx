"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, BookOpen, Clock, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";

interface AttendanceRecord {
  date: Date;
  status: "present" | "absent";
  topic: string;
  duration: string;
}

interface ClassDetails {
  id: string;
  name: string;
  teacher: string;
  totalStudents: number;
  totalClasses: number;
  attendance: number;
  attendanceRecords: AttendanceRecord[];
}

const CLASSES: Record<string, ClassDetails> = {
  math: {
    id: "math",
    name: "Advanced Mathematics",
    teacher: "Dr. Smith",
    totalStudents: 45,
    totalClasses: 78,
    attendance: 85,
    attendanceRecords: [
      {
        date: new Date(2024, 2, 10),
        status: "present",
        topic: "Linear Algebra",
        duration: "2 hours",
      },
      {
        date: new Date(2024, 2, 8),
        status: "present",
        topic: "Calculus",
        duration: "1.5 hours",
      },
      {
        date: new Date(2024, 2, 6),
        status: "absent",
        topic: "Probability",
        duration: "2 hours",
      },
    ],
  },
  cs: {
    id: "cs",
    name: "Computer Science",
    teacher: "Prof. Johnson",
    totalStudents: 38,
    totalClasses: 65,
    attendance: 92,
    attendanceRecords: [
      {
        date: new Date(2024, 2, 11),
        status: "present",
        topic: "Data Structures",
        duration: "2 hours",
      },
      {
        date: new Date(2024, 2, 9),
        status: "present",
        topic: "Algorithms",
        duration: "2 hours",
      },
    ],
  },
  physics: {
    id: "physics",
    name: "Physics",
    teacher: "Dr. Brown",
    totalStudents: 42,
    totalClasses: 70,
    attendance: 78,
    attendanceRecords: [
      {
        date: new Date(2024, 2, 9),
        status: "present",
        topic: "Quantum Mechanics",
        duration: "2 hours",
      },
      {
        date: new Date(2024, 2, 7),
        status: "absent",
        topic: "Thermodynamics",
        duration: "1.5 hours",
      },
    ],
  },
};

export default function ClassDetailsPage() {
  const { id } = useParams();
  const classDetails = CLASSES[id as string];
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const attendanceDates = classDetails.attendanceRecords.reduce((acc, record) => {
    acc[record.date.toISOString()] = record.status === "present" ? "present" : "absent";
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/student/classes">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Classes
          </Button>
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{classDetails.name}</h1>
            <p className="text-muted-foreground mt-1">Taught by {classDetails.teacher}</p>
          </div>
          <Badge
            className={
              classDetails.attendance >= 85
                ? "bg-green-500"
                : classDetails.attendance >= 75
                ? "bg-yellow-500"
                : "bg-red-500"
            }
          >
            {classDetails.attendance}% Attendance
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                  present: (date) => attendanceDates[date.toISOString()] === "present",
                  absent: (date) => attendanceDates[date.toISOString()] === "absent",
                }}
                modifiersStyles={{
                  present: { backgroundColor: "#22c55e", color: "white" },
                  absent: { backgroundColor: "#ef4444", color: "white" },
                }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classDetails.attendanceRecords.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                    <div className="flex items-center space-x-4">
                      <Badge variant={record.status === "present" ? "default" : "destructive"}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                      <div>
                        <p className="font-medium">{record.topic}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.date.toLocaleDateString()} • {record.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Total Students</span>
                  </div>
                  <span className="font-medium">{classDetails.totalStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Total Classes</span>
                  </div>
                  <span className="font-medium">{classDetails.totalClasses}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Classes Attended</span>
                  </div>
                  <span className="font-medium">
                    {classDetails.attendanceRecords.filter((r) => r.status === "present").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
