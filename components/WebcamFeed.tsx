import { useParams } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";

const WebcamFeed = () => {
  const { id } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  console.log("id", id);
  useEffect(() => {
    const enableVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setMediaStream(stream);
      } catch (error) {
        console.error("Error accessing webcam", error);
      }
    };
    enableVideoStream();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;

      // Capture frames and send for face recognition
      const intervalId = setInterval(async () => {
        if (videoRef.current) {
          const canvas = document.createElement("canvas");
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(videoRef.current, 0, 0);
          const dataURL = canvas.toDataURL("image/jpeg");
          await markAttendance(dataURL);
        }
      }, 1000); // Capture every second

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [videoRef, mediaStream]);

  const markAttendance = async (imageData: string) => {
    try {
      const response: any = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, id }),
      });

      // ✅ Parse the response to JSON
      const data = await response.json();

      if (response.ok) {
        console.log("Attendance marked successfully");
        console.log("response", response);
        if (data?.matched) {
          toast.success(`✅ Student: ${data.studentName} Attendance marked successfully`);
        }
      } else {
        console.error("Failed to mark attendance", response);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay={true} width={400} height={400} />
    </div>
  );
};

export default WebcamFeed;
