"use client";
import React, { useEffect, useState } from "react";
import { Calendar, Search, UserPlus, X, Trash2, Mail, Phone, Clock, XCircle } from "lucide-react";
import { toast } from "react-toastify";

interface Student {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  role: string;
}

function App() {
  const [Loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showStudentDetailModal, setShowStudentDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStudentClasses, setSelectedStudentClasses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // // Mock student data
  // const students: Student[] = [
  //   {
  //     id: "1",
  //     name: "Alice Johnson",
  //     email: "alice@example.com",
  //     phone: "+1 234-567-8901",
  //     enrollmentDate: "2024-01-15",
  //     status: "active",
  //     attendanceRate: 92,
  //     lastAttendance: "2024-03-11",
  //     enrolledClasses: ["Advanced Mathematics", "Physics"],
  //   },
  //   {
  //     id: "2",
  //     name: "Bob Smith",
  //     email: "bob@example.com",
  //     phone: "+1 234-567-8902",
  //     enrollmentDate: "2024-01-15",
  //     status: "active",
  //     attendanceRate: 68,
  //     lastAttendance: "2024-03-10",
  //     enrolledClasses: ["Computer Science"],
  //   },
  //   {
  //     id: "3",
  //     name: "Carol White",
  //     email: "carol@example.com",
  //     phone: "+1 234-567-8903",
  //     enrollmentDate: "2024-01-20",
  //     status: "inactive",
  //     attendanceRate: 45,
  //     lastAttendance: "2024-02-28",
  //     enrolledClasses: ["Physics"],
  //   },
  // ];

  const filteredStudents = students?.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleRemoveStudent = async (selectedClassId: string) => {
    try {
      const response = await fetch("/api/teacher/classes/remove-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: selectedClassId, studentId: selectedStudent?._id }),
      });

      const data = await response.json();
      if (response.ok) {
        toast("Student removed from class successfully!");
      } else {
        throw new Error(data.error || "Failed to remove student");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch student data from backend API
    try {
      setLoading(true);
      async function fetchStudents() {
        const response = await fetch("/api/student");
        const data = await response.json();
        console.log("datatata", data);
        setStudents(data);
      }
      fetchStudents();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  async function fetchEnrolledClasses() {
    try {
      const response = await fetch(`/api/student/detail?studentId=${selectedStudent?._id}`);
      const data = await response.json();
      if (response.ok) {
        setSelectedStudentClasses(data.classes);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching enrolled classes:", error);
    } finally {
      setLoading(false);
    }
  }

  const deleteStudent = async (studentId: string) => {
    try {
      const response = await fetch("/api/student/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });

      const data = await response.json();
      if (response.ok) {
        toast("Student deleted successfully");
        // Update frontend state by removing the deleted student
        setStudents((prevStudents) => prevStudents.filter((student) => student._id !== studentId));
      } else {
        toast(data.error || "Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast("An error occurred while deleting the student");
    }
  };

  useEffect(() => {
    if (selectedStudent?._id) {
      fetchEnrolledClasses();
    }
  }, [selectedStudent]);

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Students</h1>
        <button
          onClick={() => setShowAddStudentModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Add New Student
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr
                  key={student._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedStudent(student);
                    setShowStudentDetailModal(true);
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
                        alt={student.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">Enrolled: {student.createdAt}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle delete
                        deleteStudent(student._id);
                      }}
                      className="text-red-600 hover:text-red-900"
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

      {/* Student Detail Modal */}
      {showStudentDetailModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Student Details</h2>
              <button
                onClick={() => {
                  setShowStudentDetailModal(false);
                  setSelectedStudentClasses([]);
                  setSelectedStudent(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    selectedStudent.name
                  )}&size=128&background=random`}
                  alt={selectedStudent.name}
                  className="w-32 h-32 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                  <p className="text-gray-500">Student ID: {selectedStudent._id}</p>
                  {/* <span
                    className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                      selectedStudent.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedStudent.status.charAt(0).toUpperCase() + selectedStudent.status.slice(1)}
                  </span> */}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span>{selectedStudent.email}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Enrollment Date</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span>{selectedStudent.createdAt}</span>
                    </div>
                  </div>
                  {/* <div>
                    <label className="text-sm text-gray-500">Last Attendance</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>{selectedStudent.lastAttendance}</span>
                    </div>
                  </div> */}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Enrolled Classes</h4>
                <div className="grid grid-cols-1 gap-3">
                  {selectedStudentClasses.map((className: any, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{className.name}</span>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {
                          handleRemoveStudent(className._id);
                          fetchEnrolledClasses();
                        }}
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowStudentDetailModal(false);
                    setSelectedStudentClasses([]);
                    setSelectedStudent(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  Edit Details
                </button>
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
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter student name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Classes</label>
                <select
                  multiple
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="math">Advanced Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="cs">Computer Science</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple classes</p>
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
}

export default App;
