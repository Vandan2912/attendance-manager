import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/model/User";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { studentIds } = await request.json();

    if (!studentIds) {
      return NextResponse.json({ error: "Student IDs are required" }, { status: 400 });
    }

    // Convert string IDs to ObjectId if necessary
    const objectIds = studentIds.map((id: string) => new mongoose.Types.ObjectId(id));

    const students = await User.find({ _id: { $in: objectIds } });

    return NextResponse.json({ students });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
