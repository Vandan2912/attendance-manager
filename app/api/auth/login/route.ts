// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongodb";
import { User } from "@/model/User";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    const user: { _id: string; password: string } | null = await User.findOne({ email })
      .lean<{ _id: string; password: string }>()
      .exec();
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword, id: user._id });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
