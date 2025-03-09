"use client";
import React, { useEffect, useState } from "react";
import { ChevronRight, Plus, UserPlus, Upload, X, Trash2, Download } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

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
  const [Loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showClassDetailModal, setShowClassDetailModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [className, setClassName] = useState("");
  const [user, setUser] = useState<any>();
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);

  // // Mock data
  // const classes: Class[] = [
  //   {
  //     id: "1",
  //     name: "Advanced Mathematics",
  //     teacher: "Dr. Smith",
  //     totalClasses: 78,
  //     attendedClasses: 50,
  //     lastAttendance: "2024-03-10",
  //     totalStudents: 45,
  //     attendanceRate: 85,
  //     description: "Advanced topics in calculus, linear algebra, and differential equations.",
  //     students: [
  //       {
  //         id: "1",
  //         name: "Alice Johnson",
  //         email: "alice@example.com",
  //         attendanceRate: 92,
  //         lastAttendance: "2024-03-11",
  //         enrollmentDate: "2024-01-15",
  //       },
  //       {
  //         id: "2",
  //         name: "Bob Smith",
  //         email: "bob@example.com",
  //         attendanceRate: 68,
  //         lastAttendance: "2024-03-10",
  //         enrollmentDate: "2024-01-15",
  //       },
  //     ],
  //   },
  //   {
  //     id: "2",
  //     name: "Computer Science",
  //     teacher: "Prof. Johnson",
  //     totalClasses: 65,
  //     attendedClasses: 60,
  //     lastAttendance: "2024-03-11",
  //     totalStudents: 38,
  //     attendanceRate: 92,
  //     description: "Introduction to programming concepts and algorithms.",
  //     students: [
  //       {
  //         id: "3",
  //         name: "Carol White",
  //         email: "carol@example.com",
  //         attendanceRate: 88,
  //         lastAttendance: "2024-03-11",
  //         enrollmentDate: "2024-01-20",
  //       },
  //     ],
  //   },
  //   {
  //     id: "3",
  //     name: "Physics",
  //     teacher: "Dr. Brown",
  //     totalClasses: 70,
  //     attendedClasses: 45,
  //     lastAttendance: "2024-03-09",
  //     totalStudents: 42,
  //     attendanceRate: 78,
  //     description: "Fundamentals of mechanics and thermodynamics.",
  //     students: [],
  //   },
  // ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let teacherId = user.teacherId;
      if (user) {
        const userObj = JSON.parse(user);
        teacherId = userObj._id;
      }
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

  console.log("students", students);

  return (
    <div className="space-y-6 p-8">
      {Loading && <Loader />}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Classes</h1>
        <button
          onClick={() => setShowAddClassModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedClass(tempClassObj);
                setShowClassDetailModal(true);
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{tempClassObj.name}</h3>
                    <p className="text-sm text-gray-500">{user.name}</p>
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
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total Students</span>
                    <span className="font-medium">{tempClassObj.students?.length ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total Classes</span>
                    <span className="font-medium">{tempClassObj.totalClasses ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Last Active</span>
                    <span className="font-medium">{tempClassObj.lastAttendance ?? "-"}</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                <span className="text-sm text-gray-600">Click to manage class</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Add New Class</h2>
              <button
                onClick={() => setShowAddClassModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter class name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Add Class
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 -top-6">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">{selectedClass.name}</h2>
              <button
                onClick={() => setShowClassDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-500 mb-1">Total Students</h4>
                  <p className="text-2xl font-bold text-purple-600">{selectedClass.students?.length}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-500 mb-1">Total Classes</h4>
                  <p className="text-2xl font-bold text-blue-600">{selectedClass.totalClasses}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-500 mb-1">Attendance Rate</h4>
                  <p className="text-2xl font-bold text-green-600">{selectedClass.attendanceRate}%</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Students</h3>
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    Add Student
                  </button>
                </div>
                <div className="bg-white rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Attendance
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Active
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {students?.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    student.name
                                  )}&background=random`}
                                  alt={student.name}
                                  className="w-8 h-8 rounded-full mr-3"
                                />
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.lastAttendance}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleRemoveStudent(student._id)}
                              >
                                <Trash2 className="w-5 h-5" />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <div className="text-left">
                      <h4 className="font-medium">Upload Materials</h4>
                      <p className="text-sm text-gray-500">Share study resources</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Download className="w-5 h-5 text-gray-500" />
                    <div className="text-left">
                      <h4 className="font-medium">Download Reports</h4>
                      <p className="text-sm text-gray-500">Get attendance reports</p>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Add New Student</h2>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleAddStudent}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Add Student
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
