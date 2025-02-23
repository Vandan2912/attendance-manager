// models/Announcement.ts
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Announcement = mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);
