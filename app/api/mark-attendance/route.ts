/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/model/User";
import * as faceapi from "face-api.js";
import { Attendance } from "@/model/Attendance";
import { Class } from "@/model/Class";
import { error } from "console";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { descriptor, id } = await request.json();

    if (!descriptor) {
      return NextResponse.json({ error: "Face descriptor required" }, { status: 400 });
    }

    const storedStudents = await User.find({ role: "TEACHER", faceData: { $ne: null } });

    let bestMatch = { name: "Unknown", distance: 1.0, student: null, msg: "", error: "" };
    for (const student of storedStudents) {
      const storedDescriptor = new Float32Array(JSON.parse(student?.faceData)[0]?.descriptor);
      const descriptorArray: number[] = Object.values(descriptor); // Convert object to array

      console.log("New descriptor length:", descriptorArray.length);
      console.log("Stored descriptor length:", storedDescriptor.length);

      if (descriptorArray.length !== storedDescriptor.length) {
        console.warn("⚠️ Mismatch in descriptor lengths. Skipping this comparison.");
        continue;
      }

      const distance = faceapi.euclideanDistance(descriptorArray, storedDescriptor);

      if (distance < bestMatch.distance) {
        // check if already marked attendance
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Start of the day
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // End of the day
        const attend = await Attendance.findOne({
          studentId: student._id,
          classId: id,
          markedAt: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        });
        if (attend) {
          bestMatch = {
            ...bestMatch,
            distance,
            error: `Attendance already marked for ${student.name}`,
            student: student,
          };
          continue;
        }
        // check if student in class
        const classData = await Class.findOne({ _id: id, students: student._id });
        if (!classData) {
          bestMatch = {
            ...bestMatch,
            distance,
            error: `Student not in class ${student.name}`,
            student: student,
          };
          continue;
        }
        bestMatch = {
          ...bestMatch,
          name: student.name,
          distance,
          student: student,
          msg: `Attendance marked for ${student.name}`,
        };
        //update attendance
        await Attendance.create({
          classId: id,
          studentId: student._id,
          markedAt: new Date().toISOString(),
        });
      }
    }

    if (bestMatch.distance < 0.6) {
      return NextResponse.json({
        name: bestMatch.name,
        success: true,
        student: bestMatch.student,
        msg: bestMatch.msg,
        error: bestMatch.error,
      });
    } else {
      return NextResponse.json({ error: "Face not recognized" }, { status: 400 });
    }
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
