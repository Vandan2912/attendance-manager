import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Class } from "@/model/Class";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  try {
    const deletedClass = await Class.findByIdAndDelete(id);
    if (!deletedClass) {
      return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Class deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error deleting class" }, { status: 500 });
  }
}
