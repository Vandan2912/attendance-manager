"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail, Phone, MapPin, Calendar, GraduationCap, User, BookOpen, Clock, Shield } from "lucide-react";

interface Class {
  _id: string;
  name: string;
  teacher: string;
  totalClasses: number;
  attendedClasses: number;
  lastAttendance: string;
  totalStudents?: number;
  attendanceRate?: number;
  description?: string;
  // students?: Student[];
}

interface Student {
  name: string;
  email: string;
  createdAt: string;
  faceData: string;
  role: string;
  _id: string;
}

// Mock data - replace with actual data from your backend
const studentData = {
  id: "ST123456",
  name: "Vandan Patel",
  email: "vandan.p@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Campus Drive, College Town, ST 12345",
  dateOfBirth: "2000-05-15",
  department: "Computer Science",
  semester: "6th Semester",
  enrollmentYear: "2021",
  avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&q=80",
  courses: [
    {
      id: "CS301",
      name: "Advanced Mathematics",
      instructor: "Dr. Sarah Johnson",
      attendance: 85,
      grade: "A",
    },
    {
      id: "CS302",
      name: "Data Structures",
      instructor: "Prof. Michael Chen",
      attendance: 78,
      grade: "B+",
    },
  ],
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    department: studentData.department,
    semester: studentData.semester,
    enrollmentYear: studentData.enrollmentYear,
  });
  const [user, setUser] = useState<any>();
  const [Loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [Profile, setProfile] = useState<Student>({
    _id: "",
    createdAt: "",
    email: "",
    faceData: "",
    name: "",
    role: "",
  });

  const getClasses = async () => {
    try {
      setLoading(true);
      const user = sessionStorage.getItem("user");
      const userObj = JSON.parse(user!);
      const res = await fetch(`/api/student/classes?studentId=${userObj._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setClasses(data.classes);
      if (!res.ok) {
        throw new Error(data.error || "Failed to create class");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    try {
      setLoading(true);
      const user = sessionStorage.getItem("user");
      const userObj = JSON.parse(user!);
      const res = await fetch(`/api/student/id?studentId=${userObj._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setProfile(data);
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
    getProfile();
  }, []);

  console.log("Profile", Profile, classes);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="grid gap-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={Profile.faceData} alt={Profile.name} />
                <AvatarFallback>
                  {Profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{Profile.name}</h1>
              <p className="text-muted-foreground">Student ID: {Profile._id}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{studentData.department}</Badge>
                <Badge variant="outline">{studentData.semester}</Badge>
              </div>
            </div>
          </div>
          {/* <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "destructive" : "default"}>
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </Button> */}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal">
              <User className="h-4 w-4 mr-2" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="academic">
              <GraduationCap className="h-4 w-4 mr-2" />
              Academic Details
            </TabsTrigger>
            <TabsTrigger value="courses">
              <BookOpen className="h-4 w-4 mr-2" />
              Current Courses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="flex gap-2 items-center">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {/* {isEditing ? (
                      <Input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    ) : ( */}
                    <span>{studentData.email}</span>
                    {/* )} */}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="flex gap-2 items-center">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{studentData.phone}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <div className="flex gap-2 items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{studentData.address}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <div className="flex gap-2 items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(studentData.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="academic">
            <Card className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <div className="flex gap-2 items-center">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    {/* {isEditing ? (
                      <Input
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      />
                    ) : ( */}
                    <span>{studentData.department}</span>
                    {/* )} */}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Current Semester</Label>
                  <div className="flex gap-2 items-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {/* {isEditing ? (
                      <Input
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      />
                    ) : ( */}
                    <span>{studentData.semester}</span>
                    {/* )} */}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Enrollment Year</Label>
                  <div className="flex gap-2 items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {/* {isEditing ? (
                      <Input
                        value={formData.enrollmentYear}
                        onChange={(e) => setFormData({ ...formData, enrollmentYear: e.target.value })}
                      />
                    ) : ( */}
                    <span>{studentData.enrollmentYear}</span>
                    {/* )} */}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Student Status</Label>
                  <div className="flex gap-2 items-center">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
              </div>
              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <div className="grid gap-4">
              {studentData.courses.map((course) => (
                <Card key={course.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{course.name}</h3>
                      <p className="text-sm text-muted-foreground">{course.instructor}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Attendance:</span>
                        <Badge variant={course.attendance >= 75 ? "default" : "destructive"}>
                          {course.attendance}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-muted-foreground">Grade:</span>
                        <Badge variant="secondary">{course.grade}</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
