// app/api/announcement/create/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Announcement } from "@/model/Announcement";
import multer from "multer";
import path from "path";
import fs from "fs";
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

export async function POST(request: Request) {
  try {
    await dbConnect();
    // const { classId, title, content, fileUrl } = await request.json();

    // ✅ Convert Web API Request to FormData
    const formData = await request.formData();

    // ✅ Get File and Class ID from FormData
    const file = formData.get("file") as File;
    const classId = formData.get("classId") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const fileUrl = formData.get("fileUrl") as string;

    if (!classId) {
      return NextResponse.json({ error: "Class ID, file, Teacher ID are required" }, { status: 400 });
    }

    let filePath = "";

    if (file) {
      // ✅ Read File Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // ✅ Save File to /public/uploads
      const fileName = `${Date.now()}-${file.name}`;
      filePath = `/uploads/${fileName}`;
      const destination = path.join(process.cwd(), "public", "uploads", fileName);

      await writeFile(destination, buffer);
    }

    const announcement = await Announcement.create({
      classId,
      title,
      content,
      fileUrl: filePath,
    });

    return NextResponse.json({ announcement }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error", aa: error }, { status: 500 });
  }
}
