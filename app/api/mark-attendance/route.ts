/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/model/User";
import * as faceapi from "face-api.js";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { descriptor } = await request.json();

    if (!descriptor) {
      return NextResponse.json({ error: "Face descriptor required" }, { status: 400 });
    }

    const storedStudents = await User.find({ role: "STUDENT", faceData: { $ne: null } });

    let bestMatch = { name: "Unknown", distance: 1.0 };
    for (const student of storedStudents) {
      const storedDescriptor = new Float32Array(student.descriptor);

      console.log("New descriptor length:", descriptor.length);
      console.log("Stored descriptor length:", storedDescriptor.length);

      if (descriptor.length !== storedDescriptor.length) {
        console.warn("⚠️ Mismatch in descriptor lengths. Skipping this comparison.");
        continue;
      }

      const distance = faceapi.euclideanDistance(descriptor, storedDescriptor);

      if (distance < bestMatch.distance) {
        bestMatch = { name: student.name, distance };
      }
    }

    if (bestMatch.distance < 0.6) {
      return NextResponse.json({ name: bestMatch.name, success: true });
    } else {
      return NextResponse.json({ error: "Face not recognized" }, { status: 400 });
    }
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
