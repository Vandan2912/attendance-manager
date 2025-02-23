// app/api/classes/addStudent/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Class } from "@/model/Class";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { classId, studentId } = await request.json();

    const updatedClass = await Class.findByIdAndUpdate(classId, { $addToSet: { students: studentId } }, { new: true });

    return NextResponse.json({ class: updatedClass });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
