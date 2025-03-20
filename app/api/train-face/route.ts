import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/model/User";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { descriptors, email } = await request.json();

    if (!descriptors || !email) {
      return NextResponse.json({ error: "Descriptors and email required" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { faceData: JSON.stringify(descriptors) },
      { new: true }
    );

    return NextResponse.json({ message: "Face trained successfully", user: updatedUser });
  } catch (error) {
    console.error("Error fetching classes and attendance rates:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
