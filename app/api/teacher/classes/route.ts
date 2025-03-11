import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Class } from "@/model/Class";
import { User } from "@/model/User";
import { Attendance } from "@/model/Attendance";

export async function GET(request: Request) {
  try {
    await dbConnect();

    // get some data from headers
    const teacherId = request.headers.get("teacherId");

    // Find all classes created by the teacher.
    const classes = await Class.find({ teacherId }).lean();

    const classAttendanceRates = await Promise.all(
      classes.map(async (classItem) => {
        console.log("classItem", classItem);

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

        const teacher = await User.findOne({ _id: classItem.teacherId.toString() });

        return {
          _id: classItem._id.toString(),
          name: classItem.name,
          totalStudents: classItem.students.length,
          totalSessions,
          teacherName: teacher?.name ?? "",
        };
      })
    );

    // Optionally, you could enrich the response with attendance statistics.
    const classesWithStats = classes.map((cls) => ({
      ...cls,
      attendancePercentage: cls.attendancePercentage || 0, // use a calculated field if available
    }));

    return NextResponse.json({ classes: classesWithStats, classAttendanceRates });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { name, teacherId, studentIds } = await request.json();

    if (!name || !teacherId) {
      return NextResponse.json({ error: "Class name and teacher ID are required" }, { status: 400 });
    }

    const newClass = await Class.create({
      name,
      teacherId,
      students: studentIds || [],
      createdAt: new Date(),
      totalClasses: 0,
      attendanceRate: 0,
      lastAttendance: "",
      attendedClasses: 0,
    });

    return NextResponse.json({ message: "Class created successfully", class: newClass });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }
}
