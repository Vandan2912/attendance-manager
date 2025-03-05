import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Class } from "@/model/Class";

export async function GET() {
  try {
    await dbConnect();
    // In a real application, retrieve the logged-in teacher's ID from the session or JWT.
    // For demonstration purposes, we'll use a hardcoded teacher ID.
    const teacherId = "64f2c7a4df9d9e9b9c9e9abc"; // Replace with dynamic session logic

    // Find all classes created by the teacher.
    const classes = await Class.find({ teacherId }).lean();

    // Optionally, you could enrich the response with attendance statistics.
    const classesWithStats = classes.map((cls) => ({
      ...cls,
      attendancePercentage: cls.attendancePercentage || 0, // use a calculated field if available
    }));

    return NextResponse.json({ classes: classesWithStats });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}
