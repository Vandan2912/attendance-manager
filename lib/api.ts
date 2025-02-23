// lib/api.ts
const API_BASE = "/api";

export const api = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async createClass(name: string, teacherId: string) {
    const res = await fetch(`${API_BASE}/classes/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, teacherId }),
    });
    return res.json();
  },

  async markAttendance(classId: string, studentId: string, imagePath: string) {
    const res = await fetch(`${API_BASE}/attendance/mark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId, studentId, imagePath }),
    });
    return res.json();
  },

  async createAnnouncement(classId: string, title: string, content: string, fileUrl?: string) {
    const res = await fetch(`${API_BASE}/announcement/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId, title, content, fileUrl }),
    });
    return res.json();
  },
};
