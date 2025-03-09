import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Class } from "@/model/Class";

export async function GET(request: Request) {
  try {
    await dbConnect();

    // get some data from headers
    const teacherId = request.headers.get("teacherId");

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

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { name, teacherId, studentIds } = await request.json();

    if (!name || !teacherId) {
      return NextResponse.json({ error: "Class name and teacher ID are required" }, { status: 400 });
    }

    const newClass = await Class.create({
      name,
      teacherId,
      students: studentIds || [],
      createdAt: new Date(),
      totalClasses: 0,
      attendanceRate: 0,
      lastAttendance: "",
      attendedClasses: 0,
    });

    return NextResponse.json({ message: "Class created successfully", class: newClass });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }
}
