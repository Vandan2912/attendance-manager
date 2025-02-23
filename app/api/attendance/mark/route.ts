// app/api/attendance/mark/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Attendance } from "@/model/Attendance";
import { spawn } from "child_process";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { classId, studentId, imagePath } = await request.json();

    // Face recognition verification
    const recognizedStudent = await new Promise<string | null>((resolve, reject) => {
      const python = spawn("python", ["scripts/face_recognition.py", imagePath]);
      let dataString = "";

      python.stdout.on("data", (data) => {
        dataString += data.toString();
      });

      python.stderr.on("data", (data) => {
        console.error("Python error:", data.toString());
      });

      python.on("close", () => {
        resolve(dataString.trim() || null);
      });
    });

    if (recognizedStudent !== String(studentId)) {
      return NextResponse.json({ error: "Face not recognized" }, { status: 400 });
    }

    const attendance = await Attendance.create({
      classId,
      studentId,
      date: new Date(),
      present: true,
    });

    return NextResponse.json({ attendance });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
