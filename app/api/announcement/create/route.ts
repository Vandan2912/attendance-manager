// app/api/announcement/create/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Announcement } from "@/model/Announcement";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { classId, title, content, fileUrl } = await request.json();

    const announcement = await Announcement.create({
      classId,
      title,
      content,
      fileUrl,
    });

    return NextResponse.json({ announcement });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
