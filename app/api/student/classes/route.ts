import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Attendance } from "@/model/Attendance";
import { Class } from "@/model/Class";
import { User } from "@/model/User";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const studentId = url.searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    // Fetch all classes the student is enrolled in
    const classes: { _id: string; name: string; students: string[]; teacherId: string }[] = await Class.find({
      students: studentId,
    })
      .lean()
      .select("_id name students teacherId");

    const classAttendanceRates = await Promise.all(
      classes.map(async (classItem) => {
        const totalSessionsResult = await Attendance.aggregate([
          {
            $match: {
              classId: classItem._id.toString(),
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
              classId: classItem._id.toString(),
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

        const teacher = await User.findOne({ _id: classItem.teacherId.toString() });

        return {
          _id: classItem._id.toString(),
          name: classItem.name,
          totalStudents: classItem.students.length,
          attendanceRate,
          totalSessions,
          attendedSessionsResult,
          recentAttendanceRecords,
          teacherName: teacher?.name ?? "",
        };
      })
    );

    return NextResponse.json({ studentId, classes: classAttendanceRates });
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
