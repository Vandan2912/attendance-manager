"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Users,
  Bell,
  AlertCircle,
  Plus,
  UserPlus,
  Upload,
  PieChart,
  GraduationCap,
  School,
  ArrowRight,
  Eye,
  FileIcon,
  X,
} from "lucide-react";
import "react-calendar-heatmap/dist/styles.css";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

type UserRole = "STUDENT" | "TEACHER";

interface Class {
  _id: string;
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
  teacherName: string;
  totalSessions: number;
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

interface FormData {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "TEACHER";
}

function App() {
  const [user, setUser] = useState<any>();
  const [className, setClassName] = useState("");
  const [Loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedClass, setselectedClass] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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

  const getClasses = async () => {
    try {
      setLoading(true);
      const user = sessionStorage.getItem("user");
      let teacherId = "";
      if (user) {
        const userObj = JSON.parse(user);
        teacherId = userObj._id;
      }
      const res = await fetch(`/api/teacher/classes`, {
        method: "GET",
        headers: { "Content-Type": "application/json", teacherId },
      });

      const data = await res.json();
      setClasses(data.classAttendanceRates);
      if (!res.ok) {
        throw new Error(data.error || "Failed to create class");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClassAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const teacherId = user._id;
      const res = await fetch("/api/teacher/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: className,
          teacherId: teacherId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast("Class created successfully!");
        setShowAddClassModal(false);
        getClasses();
      } else {
        throw new Error(data.error || "Failed to create class");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log("datadatadatadata", data);
    if (data.user) {
      toast("Student added successfuly");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
      });
    } else {
      console.log(data.error);
      toast(data.error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle file upload logic here
    console.log(acceptedFiles);
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "video/*": [".mp4", ".webm"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  });

  const addAnnouncement = () => {
    // validate payload
    if (selectedClass === "" || title === "" || content === "") {
      toast.error("Please add all details");
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
      formData.append("fileUrl", `/uploads/${file?.name}`);
    }
    formData.append("classId", selectedClass);
    formData.append("title", title);
    formData.append("content", content);

    // Add announcement to the server
    fetch("/api/announcement/create", {
      method: "POST",
      // headers: { "Content-Type": "application/json" },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          toast.error("Failed to create announcement");
          return;
        }
        setIsCreating(false);
        setTitle("");
        setContent("");
        setFile(null);
        setselectedClass("");
        toast.success("Announcement created successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to create announcement");
      });
  };

  useEffect(() => {
    // Fetch student data from backend API
    try {
      setLoading(true);
      async function fetchStudents() {
        const response = await fetch("/api/student");
        const data = await response.json();
        setStudents(data.splice(0, 3));
      }
      fetchStudents();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      setUser(userObj);
    }
    getClasses();
  }, []);

  return (
    <div>
      {Loading && <Loader />}
      <div className="space-y-6 p-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

          <button
            className="p-4 bg-blue-50 rounded-xl flex items-center gap-3 hover:bg-blue-100 transition-colors"
            onClick={() => setShowAddStudentModal(true)}
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Add Students</h3>
              <p className="text-sm text-gray-500">Enroll new students</p>
            </div>
          </button>

          <button
            className="p-4 bg-green-50 rounded-xl flex items-center gap-3 hover:bg-green-100 transition-colors"
            onClick={() => setIsCreating(true)}
          >
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Upload Resources</h3>
              <p className="text-sm text-gray-500">Share study materials</p>
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
                    <span>{classItem.totalSessions} classes</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span></span>
                    <span>{classItem.totalStudents} students</span>
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
                    {/* <span className={`ml-auto text-sm font-semibold ${getAttendanceColor(student.attendanceRate)}`}>
                      {student.attendanceRate}%
                    </span> */}
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
            <form className="space-y-4" onSubmit={handleClassAdd}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Enter class name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
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
                  onClick={() => {
                    setShowAddClassModal(false);
                    setClassName("");
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Student</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 text-black border-0 focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-black border-0 focus:ring-2 focus:ring-purple-500"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 text-black border-0 focus:ring-2 focus:ring-purple-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Add Student
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStudentModal(false);
                    setClassName("");
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <Card className="">
              <CardHeader>
                <CardTitle>Create New Announcement</CardTitle>
                <CardDescription>Share important information with your class</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="Enter announcement title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Class</label>
                      <Select value={selectedClass} onValueChange={(e) => setselectedClass(e)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((classItem: any) => (
                            <SelectItem key={classItem._id} value={classItem._id}>
                              {classItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      placeholder="Write your announcement here..."
                      className="min-h-[150px]"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Attachments</label>
                    {/* <div className="border-2 border-dashed p-4 rounded-lg text-center">
                        <Button variant="outline" className="w-full">
                          <Paperclip className="h-4 w-4 mr-2" />
                          Add Files
                        </Button>
                      </div> */}

                    <div className="space-y-6">
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                          isDragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-500"
                        }`}
                      >
                        <input {...getInputProps()} />
                        <Upload className="h-12 text-purple-500 w-12 mb-4 mx-auto" />
                        <p className="text-gray-600">
                          {isDragActive ? "Drop the files here..." : "Drag & drop files here, or click to select files"}
                        </p>
                        <p className="text-gray-500 text-sm mt-2">Supports: PDF, Word, Images, Videos (Max 100MB)</p>
                      </div>

                      <div>
                        {file && (
                          <div className="flex gap-4 items-center">
                            <div className="bg-purple-50 p-2 rounded-lg">
                              <FileIcon className="h-6 text-purple-600 w-6" />
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-700 text-sm font-medium">{file.name}</p>
                              <p className="text-gray-500 text-xs">{file.size} bytes</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFile(null)}
                              className="bg-red-50 p-2 rounded-lg text-red-500 hover:bg-red-100 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={(e) => {
                        e.preventDefault();
                        addAnnouncement();
                      }}
                    >
                      Publish Announcement
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
