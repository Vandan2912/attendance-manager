"use client";
import React, { useState } from "react";
import { Eye, ArrowRight, GraduationCap, School } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "TEACHER";
}

function App() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleDrawer, setShowRoleDrawer] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log("datadatadatadata", data);
    if (data.user) {
      document.cookie = `token=${data.id}; path=/`;
      sessionStorage.setItem("role", data.user.role);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "TEACHER") {
        router.push("/teacher/dashboard");
      } else {
        router.push("/student/photo");
      }
    } else {
      console.log(data.error);
      toast(data.msg);
    }
  };

  const selectRole = (role: "STUDENT" | "TEACHER") => {
    setFormData((prev) => ({ ...prev, role }));
    setShowRoleDrawer(false);
  };

  return (
    <div className="min-h-screen bg-[#2A2A3C] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-[#1E1E2E] rounded-2xl overflow-hidden flex shadow-2xl">
        {/* Left Side - Image Section */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-b from-purple-600 to-purple-900 p-12 flex-col justify-between">
          <div>
            {/* <h2 className="text-2xl font-bold text-white">AMS</h2> */}
            {/* <button className="mt-4 px-4 py-2 bg-white/20 rounded-full text-white text-sm flex items-center gap-2">
              Back to website <ArrowRight className="w-4 h-4" />
            </button> */}
          </div>

          <div>
            <img
              src="sassc.jpg"
              alt="Desert Landscape"
              className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay brightness-50"
            />
            <h1 className="text-4xl font-bold text-white mb-4 relative">
              Welcome to SASSC
              {/* <br />
              Creating Memories */}
            </h1>
            {/* <div className="flex gap-2 relative">
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div> */}
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-4xl font-bold text-white mb-2">Create an account</h2>
            <p className="text-gray-400 mb-8">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-500 hover:text-purple-400">
                Log in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#2A2A3C] text-white border-0 focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-[#2A2A3C] text-white border-0 focus:ring-2 focus:ring-purple-500"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#2A2A3C] text-white border-0 focus:ring-2 focus:ring-purple-500"
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

              {/* Role Selection Button */}
              <button
                type="button"
                onClick={() => setShowRoleDrawer(true)}
                className="w-full px-4 py-3 rounded-lg bg-[#2A2A3C] text-white border-0 focus:ring-2 focus:ring-purple-500 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  {formData.role === "STUDENT" ? <GraduationCap className="w-5 h-5" /> : <School className="w-5 h-5" />}
                  {formData.role === "STUDENT" ? "Student" : "Teacher"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="submit"
                className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Create account
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Role Selection Drawer */}
      {showRoleDrawer && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center sm:items-center p-4 z-50">
          <div className="bg-[#1E1E2E] w-full max-w-md rounded-2xl p-6 animate-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-bold text-white mb-6">Choose your role</h3>
            <div className="space-y-4">
              <button
                onClick={() => selectRole("STUDENT")}
                className={`w-full p-4 rounded-lg flex items-center gap-4 transition-colors ${
                  formData.role === "STUDENT"
                    ? "bg-purple-500 text-white"
                    : "bg-[#2A2A3C] text-gray-300 hover:bg-[#353548]"
                }`}
              >
                <GraduationCap className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Student</div>
                  <div className="text-sm opacity-80">Join as a student to learn and grow</div>
                </div>
              </button>

              <button
                onClick={() => selectRole("TEACHER")}
                className={`w-full p-4 rounded-lg flex items-center gap-4 transition-colors ${
                  formData.role === "TEACHER"
                    ? "bg-purple-500 text-white"
                    : "bg-[#2A2A3C] text-gray-300 hover:bg-[#353548]"
                }`}
              >
                <School className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Teacher</div>
                  <div className="text-sm opacity-80">Join as a teacher to share knowledge</div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowRoleDrawer(false)}
              className="w-full mt-6 py-3 bg-[#2A2A3C] text-gray-300 rounded-lg hover:bg-[#353548] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
