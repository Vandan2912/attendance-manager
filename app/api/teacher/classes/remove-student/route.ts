import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Class } from "@/model/Class";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { classId, studentId } = await request.json();

    if (!classId || !studentId) {
      return NextResponse.json({ error: "Class ID and student ID are required" }, { status: 400 });
    }

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      {
        $pull: { students: new mongoose.Types.ObjectId(studentId) },
      },
      { new: true }
    );

    if (!updatedClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Student removed from class successfully", class: updatedClass });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to remove student from class" }, { status: 500 });
  }
}
