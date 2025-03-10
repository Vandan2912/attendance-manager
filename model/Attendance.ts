// models/Attendance.ts
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  markedAt: {
    type: Date,
    required: true,
  },
});

export const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
