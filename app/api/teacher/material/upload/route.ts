import multer from "multer";
import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { ClassMaterial } from "@/model/ClassMaterial";
import { IncomingForm } from "formidable";
import { writeFile } from "fs/promises";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    // ✅ Convert Web API Request to FormData
    const formData = await req.formData();

    // ✅ Get File and Class ID from FormData
    const file = formData.get("file") as File;
    const classId = formData.get("classId") as string;
    const teacherId = formData.get("teacherId") as string;

    if (!file || !classId || !teacherId) {
      return NextResponse.json({ error: "Class ID, file, Teacher ID are required" }, { status: 400 });
    }

    // ✅ Read File Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ✅ Save File to /public/uploads
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `/uploads/${fileName}`;
    const destination = path.join(process.cwd(), "public", "uploads", fileName);

    await writeFile(destination, buffer);

    // ✅ Save File Details in Database
    const newMaterial = new ClassMaterial({
      classId,
      fileName: file.name,
      filePath,
      uploadedBy: teacherId, // Later we will use JWT to get user
    });

    await newMaterial.save();

    return NextResponse.json({
      message: "Material uploaded successfully",
      filePath,
    });
  } catch (error) {
    console.error("[❌] File Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");

  if (!classId) {
    return NextResponse.json({ error: "Class ID is required" }, { status: 400 });
  }

  const materials = await ClassMaterial.find({ classId });

  return NextResponse.json({ materials });
}

export async function DELETE(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const materialId = searchParams.get("materialId");

  if (!materialId) {
    return NextResponse.json({ error: "Material ID is required" }, { status: 400 });
  }

  const material = await ClassMaterial.findById(materialId);
  if (!material) {
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  }

  // Remove file from server
  const filePath = path.join(process.cwd(), "public", material.filePath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await ClassMaterial.findByIdAndDelete(materialId);

  return NextResponse.json({ message: "Material deleted successfully" });
}
