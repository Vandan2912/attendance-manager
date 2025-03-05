import StudentWebcam from "@/components/StudentWebcam";

export default function CapturePhotoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Capture Your Photo</h1>
      <p className="mb-6 text-gray-600">Please take a clear photo for attendance purposes.</p>
      <StudentWebcam />
    </div>
  );
}
