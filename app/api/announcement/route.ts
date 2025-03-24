// app/api/announcement/create/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Announcement } from "@/model/Announcement";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { classId } = await request.json();
    if (classId !== "") {
      const announcement = await Announcement.find({
        classId,
      });
      return NextResponse.json({ announcement });
    } else {
      const announcement = await Announcement.find({});
      return NextResponse.json({ announcement });
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Get announcement by id
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const announcement = await Announcement.findById(id);
      return NextResponse.json({ announcement });
    }

    const announcement = await Announcement.find({});
    return NextResponse.json({ announcement });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
