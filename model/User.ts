// models/User.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["TEACHER", "STUDENT"],
    required: true,
  },
  classes: [
    {
      classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
      className: {
        type: String,
      },
    },
  ],
  faceData: {
    type: String,
  }, // Base64 encoded face recognition data
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
