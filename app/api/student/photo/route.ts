// app/api/student/photo/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

export async function POST(request: Request) {
  try {
    const { image, studentId } = await request.json();

    // Save the image to a directory
    const imgBuffer = Buffer.from(image.split(",")[1], "base64");
    const imgPath = path.join("scripts", "student_photos", `${studentId}.jpg`);
    fs.writeFileSync(imgPath, imgBuffer);

    // Trigger the training script
    await new Promise((resolve, reject) => {
      const python = spawn("python", ["scripts/train_face_recognition.py"]);
      python.stdout.on("data", (data) => {
        console.log("Training output:", data.toString());
      });
      python.stderr.on("data", (data) => {
        console.error("Training error:", data.toString());
      });
      python.on("close", () => {
        resolve(void 0);
      });
    });

    return NextResponse.json({ message: "Photo uploaded and model trained successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload photo or train model", aa: error }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb";
// import { User } from "@/model/User";

// export async function POST(request: Request) {
//   try {
//     await dbConnect();
//     console.log("Photo upload request received", request);

//     const { image, studentId } = await request.json();

//     if (!image) {
//       return NextResponse.json({ error: "No image provided" }, { status: 400 });
//     }

//     // Update the student's record with the Base64 image
//     await User.findByIdAndUpdate(studentId, { faceData: image });

//     return NextResponse.json({ message: "Photo uploaded successfully" });
//   } catch (error) {
//     console.error("Error uploading photo:", error);
//     return NextResponse.json({ error: error }, { status: 500 });
//   }
// }
