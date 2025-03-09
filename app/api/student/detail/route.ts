import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Class } from "@/model/Class";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const studentId = url.searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    // Find all classes where the student is enrolled
    const classes = await Class.find({ students: studentId }).lean();

    return NextResponse.json({ classes });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch enrolled classes" }, { status: 500 });
  }
}
