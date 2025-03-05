import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/model/User";

export async function POST(request: Request) {
  try {
    await dbConnect();
    console.log("Photo upload request received", request);

    const { image, studentId } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Update the student's record with the Base64 image
    await User.findByIdAndUpdate(studentId, { faceData: image });

    return NextResponse.json({ message: "Photo uploaded successfully" });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
