"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const StudentWebcam: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    }
  };

  const retakePhoto = () => {
    setImgSrc(null);
  };

  const uploadPhoto = async () => {
    if (!imgSrc) return;

    try {
      setUploading(true);
      const user = sessionStorage.getItem("user");
      let studentId = "";
      if (user) {
        const userObj = JSON.parse(user);
        studentId = userObj._id;
      }
      const response = await fetch("/api/student/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imgSrc, studentId: studentId }),
      });

      if (response.ok) {
        alert("Photo uploaded successfully!");
        setImgSrc(null); // Reset after successful upload
      } else {
        alert("Failed to upload photo.");
      }
    } catch (error) {
      console.log("Error uploading photo:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="webcam-container">
      {imgSrc ? (
        <>
          <img src={imgSrc} alt="Captured" />
          <div>
            <button onClick={retakePhoto}>Retake Photo</button>
            <button onClick={uploadPhoto} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </>
      ) : (
        <>
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width={400} height={400} />
          <button onClick={capture}>Capture Photo</button>
        </>
      )}
    </div>
  );
};

export default StudentWebcam;
