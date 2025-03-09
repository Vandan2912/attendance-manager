// import { NextResponse } from "next/server";
// import { spawn } from "child_process";

// export async function POST(request: Request) {
//   try {
//     const { image } = await request.json();

//     console.log(`Attendance marked for startedddddddd`);

//     // Call the Python script for face recognition
//     const recognizedStudent = await new Promise<string | null>((resolve, reject) => {
//       const python = spawn("python", ["scripts/face_recognition_file.py", image]);
//       let dataString = "";

//       python.stdout.on("data", (data) => {
//         dataString += data.toString();
//         console.log(` python.stdout : ${data}`);
//       });

//       python.stderr.on("data", (data) => {
//         console.error("Python error:", data.toString());
//       });

//       python.on("close", () => {
//         resolve(dataString.trim() || null);
//       });
//     });

//     console.log(`Attendance marked for ${recognizedStudent}`);

//     if (recognizedStudent) {
//       // Mark attendance for the recognized student
//       console.log(`Attendance marked for ${recognizedStudent}`);
//       return NextResponse.json({ message: "Attendance marked successfully", recognizedStudent });
//     } else {
//       return NextResponse.json({ error: "No match found" }, { status: 400 });
//     }
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { User } from "@/model/User";

export async function POST(request: Request) {
  try {
    const { image, id } = await request.json();

    console.log(`Attendance marked for started`);

    // Decode base64 image
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Save the image temporarily
    const filePath = path.join("/tmp", `face_${Date.now()}.jpg`);
    fs.writeFileSync(filePath, buffer);

    // Call the Python script with the file path
    const recognizedStudent = await new Promise<string | null>((resolve, reject) => {
      const python = spawn("python", ["scripts/face_recognition_file.py", filePath, id]);
      let dataString = "";

      python.stdout.on("data", (data) => {
        dataString += data.toString();
      });

      python.stderr.on("data", (data) => {
        console.error("Python error:", data.toString());
      });

      python.on("close", () => {
        // Clean up the file after recognition
        fs.unlinkSync(filePath);
        resolve(dataString.trim() || null);
      });
    });

    console.log(`Attendance marked for ${recognizedStudent}`);

    let matched = false;
    let studentName = "";
    if (recognizedStudent) {
      // Extract the ID using a Regular Expression
      const match = recognizedStudent.match(/Attendance Marked for: ([0-9a-fA-F]+)/);

      // Check if a match is found
      if (match) {
        const studentId = match[1];
        console.log("Student ID:", studentId);
        const studentData = await User.findOne({ _id: studentId });
        studentName = studentData?.name || "";
        matched = true;
      } else {
        console.log("No Student ID found.");
      }
    }

    return NextResponse.json({ success: true, recognizedStudent, matched, studentName });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json({ success: false, error });
  }
}
