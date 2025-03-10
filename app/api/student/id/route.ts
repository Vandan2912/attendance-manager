import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/model/User";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const studentId = url.searchParams.get("studentId");

    const students = await User.findOne({ role: "STUDENT", _id: studentId }).lean();

    return NextResponse.json(students);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
