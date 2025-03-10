import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Attendance } from "@/model/Attendance";
import { Class } from "@/model/Class";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const studentId = url.searchParams.get("studentId");
    const classId = url.searchParams.get("classId");

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    // Fetch all classes the student is enrolled in
    interface ClassItem {
      _id: string;
      name: string;
      students: string[];
    }

    const classItem = (await Class.findOne({
      students: studentId,
      _id: classId,
    })
      .lean()
      .select("_id name students")) as ClassItem | null;

    if (!classItem) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const totalSessionsResult = await Attendance.aggregate([
      {
        $match: {
          classId: classId,
          //   studentId: "67ce01ed9827ab9af1d2fd09",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$markedAt" } } },
        },
      },
    ]);

    const totalSessions = totalSessionsResult.length;

    // Count attended sessions for the student in the class
    const attendedSessionsResult = await Attendance.aggregate([
      {
        $match: {
          classId: classId,
          studentId,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$markedAt" } } }, // Convert markedAt to Date
        },
      },
    ]);

    const attendedSessions = attendedSessionsResult.length;

    // Create recent attendance records
    const recentAttendanceRecords = totalSessionsResult.map((session) => {
      const isPresent = attendedSessionsResult.some((attended) => attended._id === session._id);
      return {
        date: session._id,
        present: isPresent,
      };
    });

    // Calculate attendance rate
    const attendanceRate = totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0;

    // return {
    //   _id: classItem._id.toString(),
    //   name: classItem.name,
    //   totalStudents: classItem.students.length,
    //   attendanceRate,
    //   totalSessions,
    //   attendedSessionsResult,
    //   recentAttendanceRecords,
    // };

    return NextResponse.json({
      _id: classId,
      name: classItem.name,
      totalStudents: classItem.students.length,
      attendanceRate,
      totalSessions,
      attendedSessionsResult,
      recentAttendanceRecords,
      attendedSessions,
    });
  } catch (error) {
    console.error("Error fetching classes and attendance rates:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// return {
//     id: classItem._id,
//     name: classItem.name,
//     totalStudents: classItem.students.length ?? 0,
//     attendanceRate,
//     totalSessions,
//   };
