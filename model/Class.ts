// models/Class.ts
import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  totalClasses: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
  attendanceRate: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
  lastAttendance: {
    type: mongoose.Schema.Types.String,
    default: "-",
  },
  attendedClasses: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Class = mongoose.models.Class || mongoose.model("Class", classSchema);
