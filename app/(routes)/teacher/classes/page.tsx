"use client";
import React, { useCallback, useEffect, useState } from "react";
import { ChevronRight, Plus, UserPlus, Upload, X, Trash2, Download, View, FileIcon } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

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
}

interface Student {
  _id: string;
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
  const router = useRouter();
  const [Loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [user, setUser] = useState<any>();
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showClassDetailModal, setShowClassDetailModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [className, setClassName] = useState("");
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [showUploadMaterialModal, setShowUploadMaterialModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/teacher/classes/add-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: selectedClass?._id, studentEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        toast("Students added to class successfully!");
        getClasses();
      } else {
        throw new Error(data.error || "Failed to add students");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function fetchStudents() {
    try {
      const response = await fetch("/api/teacher/by-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentIds: selectedClass?.students }),
      });

      const data = await response.json();
      if (response.ok) {
        setStudents(data.students);
      } else {
        console.error(data.error || "Failed to fetch students");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleRemoveStudent = async (studentId: string) => {
    try {
      const response = await fetch("/api/teacher/classes/remove-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: selectedClass?._id, studentId }),
      });

      const data = await response.json();
      if (response.ok) {
        toast("Student removed from class successfully!");
        getClasses();
        fetchStudents();
      } else {
        throw new Error(data.error || "Failed to remove student");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("classId", selectedClass?._id);
    formData.append("teacherId", user._id);

    try {
      const response = await fetch("/api/teacher/material/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Material uploaded successfully!");
      } else {
        toast.error(data.error || "Failed to upload material.");
      }
    } catch (error) {
      toast.error("Error uploading material.");
      console.error(error);
    }
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

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      setUser(userObj);
    }
    getClasses();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [selectedClass]);

  return (
    <div className="p-8 space-y-6">
      {Loading && <Loader />}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Classes</h1>
        <button
          onClick={() => setShowAddClassModal(true)}
          className="flex bg-purple-500 rounded-lg text-white gap-2 hover:bg-purple-600 items-center px-4 py-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Create New Class
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2">
        {classes?.map((classItem) => {
          const tempClassObj = {
            ...classItem,
            totalClasses: classItem.totalClasses ?? 0,
            attendanceRate: classItem.attendanceRate ?? 0,
            lastAttendance: classItem.lastAttendance ?? "",
            attendedClasses: classItem.attendedClasses ?? 0,
          };
          return (
            <div
              key={tempClassObj.id}
              className="bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md overflow-hidden transition-shadow"
              onClick={() => {
                setSelectedClass(tempClassObj);
                setShowClassDetailModal(true);
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{tempClassObj.name}</h3>
                    <p className="text-gray-500 text-sm">{user.name}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tempClassObj.attendanceRate! >= 85
                        ? "bg-green-100 text-green-800"
                        : tempClassObj.attendanceRate! >= 75
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tempClassObj.attendanceRate}% Attendance
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-500">Total Students</span>
                    <span className="font-medium">{tempClassObj.students?.length ?? 0}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-500">Total Classes</span>
                    <span className="font-medium">{tempClassObj.totalClasses ?? 0}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-500">Last Active</span>
                    <span className="font-medium">{tempClassObj.lastAttendance ?? "-"}</span>
                  </div>
                </div>
              </div>
              <div className="flex bg-gray-50 justify-between items-center px-6 py-4">
                <span className="text-gray-600 text-sm">Click to manage class</span>
                <ChevronRight className="h-5 text-gray-400 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="flex bg-black/50 justify-center p-4 fixed inset-0 items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add New Class</h2>
              <button
                onClick={() => setShowAddClassModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 text-gray-500 w-6" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="text-gray-700 text-sm block font-medium mb-1">Class Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter class name"
                  className="border border-gray-200 rounded-lg w-full focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 px-4 py-2"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="flex-1 bg-purple-500 rounded-lg text-white hover:bg-purple-600 py-2 transition-colors"
                >
                  Add Class
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 py-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Detail Modal */}
      {showClassDetailModal && selectedClass && (
        <div className="flex bg-black/50 justify-center p-4 -top-6 fixed inset-0 items-center z-50">
          <div className="bg-white rounded-xl w-full max-h-[90vh] max-w-4xl overflow-hidden">
            <div className="flex border-b justify-between p-6 items-center">
              <h2 className="text-2xl font-bold">{selectedClass.name}</h2>
              <button
                onClick={() => setShowClassDetailModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 text-gray-500 w-6" />
              </button>
            </div>
            <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-gray-500 text-sm mb-1">Total Students</h4>
                  <p className="text-2xl text-purple-600 font-bold">{selectedClass.students?.length}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-gray-500 text-sm mb-1">Total Classes</h4>
                  <p className="text-2xl text-blue-600 font-bold">{selectedClass.totalClasses}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-gray-500 text-sm mb-1">Attendance Rate</h4>
                  <p className="text-2xl text-green-600 font-bold">{selectedClass.attendanceRate}%</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Students</h3>
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="flex bg-purple-500 rounded-lg text-white gap-2 hover:bg-purple-600 items-center px-4 py-2 transition-colors"
                  >
                    <UserPlus className="h-5 w-5" />
                    Add Student
                  </button>
                </div>
                <div className="bg-white border rounded-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-gray-500 text-left text-xs font-medium px-6 py-3 tracking-wider uppercase">
                            Name
                          </th>
                          <th className="text-gray-500 text-left text-xs font-medium px-6 py-3 tracking-wider uppercase">
                            Email
                          </th>
                          <th className="text-gray-500 text-left text-xs font-medium px-6 py-3 tracking-wider uppercase">
                            Attendance
                          </th>
                          <th className="text-gray-500 text-left text-xs font-medium px-6 py-3 tracking-wider uppercase">
                            Last Active
                          </th>
                          <th className="text-gray-500 text-right text-xs font-medium px-6 py-3 tracking-wider uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-gray-200 divide-y">
                        {students?.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    student.name
                                  )}&background=random`}
                                  alt={student.name}
                                  className="h-8 rounded-full w-8 mr-3"
                                />
                                <div className="text-gray-900 text-sm font-medium">{student.name}</div>
                              </div>
                            </td>
                            <td className="text-gray-500 text-sm px-6 py-4 whitespace-nowrap">{student.email}</td>
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
                            <td className="text-gray-500 text-sm px-6 py-4 whitespace-nowrap">
                              {student.lastAttendance}
                            </td>
                            <td className="text-right text-sm font-medium px-6 py-4 whitespace-nowrap">
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleRemoveStudent(student._id)}
                              >
                                <Trash2 className="h-5 w-5" />
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <button
                    className="flex bg-gray-50 p-4 rounded-lg gap-3 hover:bg-gray-100 items-center transition-colors"
                    onClick={() => setShowUploadMaterialModal(true)}
                  >
                    <Upload className="h-5 text-gray-500 w-5" />
                    <div className="text-left">
                      <h4 className="font-medium">Upload Materials</h4>
                      <p className="text-gray-500 text-sm">Share study resources</p>
                    </div>
                  </button>
                  <button
                    className="flex bg-gray-50 p-4 rounded-lg gap-3 hover:bg-gray-100 items-center transition-colors"
                    onClick={() => {
                      router.push(`/teacher/classes/${selectedClass._id}`);
                    }}
                  >
                    <View className="h-5 text-gray-500 w-5" />
                    <div className="text-left">
                      <h4 className="font-medium">All Materials</h4>
                      <p className="text-gray-500 text-sm">Uploaded tudy resources</p>
                    </div>
                  </button>
                  <button className="flex bg-gray-50 p-4 rounded-lg gap-3 hover:bg-gray-100 items-center transition-colors">
                    <Download className="h-5 text-gray-500 w-5" />
                    <div className="text-left">
                      <h4 className="font-medium">Download Reports</h4>
                      <p className="text-gray-500 text-sm">Get attendance reports</p>
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
        <div className="flex bg-black/50 justify-center p-4 fixed inset-0 items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add New Student</h2>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 text-gray-500 w-6" />
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleAddStudent}>
              <div>
                <label className="text-gray-700 text-sm block font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="border border-gray-200 rounded-lg w-full focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 px-4 py-2"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-500 rounded-lg text-white hover:bg-purple-600 py-2 transition-colors"
                >
                  Add Student
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 py-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {/* {showUploadMaterialModal && (
        <div className="flex bg-black/50 justify-center p-4 fixed inset-0 items-center z-[51]">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Upload Material</h2>
              <button
                onClick={() => setShowUploadMaterialModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 text-gray-500 w-6" />
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleAddStudent}>
              <div>
                <label className="text-gray-700 text-sm block font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="border border-gray-200 rounded-lg w-full focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 px-4 py-2"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-500 rounded-lg text-white hover:bg-purple-600 py-2 transition-colors"
                >
                  upload
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadMaterialModal(false)}
                  className="flex-1 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 py-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}

      {/* Upload Modal */}
      {showUploadMaterialModal && (
        <div className="flex bg-black/50 justify-center p-4 fixed inset-0 items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Upload Material</h2>
              <button
                onClick={() => setShowUploadMaterialModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 text-gray-500 w-6" />
              </button>
            </div>

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

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadMaterialModal(false)}
                  className="flex-1 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 px-4 py-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-500 rounded-lg text-white hover:bg-purple-600 px-4 py-2 transition-colors"
                  onClick={handleUpload}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
