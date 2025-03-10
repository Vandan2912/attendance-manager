"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, BookOpen, Clock, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

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
  attendanceRate: number;
  attendanceRecords: AttendanceRecord[];
}

interface Class {
  id: string;
  name: string;
  attendanceRate: number;
  attendedSessionsResult: { _id: string }[];
  recentAttendanceRecords: { date: string; present: boolean }[];
  totalSessions: number;
  totalStudents: number;
  attendedSessions: number;
}

const defaultData = {
  id: "",
  name: "",
  attendanceRate: 0,
  attendedSessionsResult: [],
  recentAttendanceRecords: [],
  totalSessions: 0,
  totalStudents: 0,
  attendedSessions: 0,
};

export default function ClassDetailsPage() {
  const { id } = useParams();

  const [Loading, setLoading] = useState(false);
  const [classDetails, setClassDetails] = useState<Class>(defaultData);
  const [user, setUser] = useState<any>();

  const getClasses = async () => {
    try {
      setLoading(true);
      const user = sessionStorage.getItem("user");
      const userObj = JSON.parse(user!);
      const res = await fetch(`/api/student/classes/detail?studentId=${userObj._id}&classId=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setClassDetails(data);
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

  console.log("classDetails", classDetails);

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
            <h1 className="text-3xl font-bold">{classDetails?.name}</h1>
          </div>
          <Badge
            className={
              classDetails?.attendanceRate >= 85
                ? "bg-green-500"
                : classDetails?.attendanceRate >= 75
                ? "bg-yellow-500"
                : "bg-red-500"
            }
          >
            {classDetails?.attendanceRate}% Attendance
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
                // selected={selectedDate}
                // onSelect={setSelectedDate}
                modifiers={{
                  present: (date) =>
                    classDetails?.recentAttendanceRecords?.some(
                      (item) => format(date, "yyyy-MM-dd") === item.date && item.present
                    ),
                  absent: (date) =>
                    classDetails?.recentAttendanceRecords?.some(
                      (item) => format(date, "yyyy-MM-dd") === item.date && !item.present
                    ),
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
                {classDetails?.recentAttendanceRecords?.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                    <div className="flex items-center space-x-4">
                      <Badge variant={record.present ? "default" : "destructive"}>
                        {record.present ? "Present" : "Absent"}
                      </Badge>
                      <div>
                        <p className="font-medium">{record.date}</p>
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
                  <span className="font-medium">{classDetails?.totalStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Total Classes</span>
                  </div>
                  <span className="font-medium">{classDetails?.totalSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Classes Attended</span>
                  </div>
                  <span className="font-medium">{classDetails?.attendedSessions}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
