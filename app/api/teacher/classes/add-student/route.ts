import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Class } from "@/model/Class";
import mongoose from "mongoose";
import { User } from "@/model/User";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { classId, studentEmail } = await request.json();

    if (!classId || !studentEmail) {
      return NextResponse.json({ error: "Class ID and student IDs are required" }, { status: 400 });
    }

    const studentData = await User.findOne({ email: studentEmail, role: "STUDENT" });

    if (!studentData) {
      return NextResponse.json({ error: "Email Id not found or not a student user" }, { status: 400 });
    }

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      {
        $addToSet: { students: studentData },
      },
      { new: true }
    );

    // Update student documents
    const data = await User.findOneAndUpdate(
      { email: studentEmail },
      {
        $addToSet: { classes: updatedClass._id },
      }
    );

    if (!updatedClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Students added to class successfully", class: updatedClass, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add students to class" }, { status: 500 });
  }
}
