// app/api/classes/create/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Class } from "@/model/Class";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, teacherId } = await request.json();

    const newClass = await Class.create({
      name,
      teacherId,
      students: [],
    });

    return NextResponse.json({ class: newClass });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
