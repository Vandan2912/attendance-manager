// app/api/classes/create/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Class } from "@/model/Class";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { teacherId } = await request.json();

    const newClass = await Class.find({
      teacherId,
    });

    return NextResponse.json({ class: newClass });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
