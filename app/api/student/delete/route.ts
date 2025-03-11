import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/model/User";
import { Class } from "@/model/Class";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    // Remove student from the User collection
    const deletedStudent = await User.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Remove student from all associated classes
    await Class.updateMany({ students: studentId }, { $pull: { students: studentId } });

    return NextResponse.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
