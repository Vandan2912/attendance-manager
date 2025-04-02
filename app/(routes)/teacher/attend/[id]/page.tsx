"use client";
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

const FaceRecognition = () => {
  const { id } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [studentName, setStudentName] = useState("Unknown");
  const [mood, setMood] = useState("Neutral");
  const [isCallingAPI, setIsCallingAPI] = useState(false);
  const intervalId = useRef<NodeJS.Timeout | null>(null); // Track interval

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Wait for the video to load its metadata before running detection
          videoRef.current.onloadedmetadata = () => {
            console.log("✅ Video loaded. Starting face detection...");
            detectFaces(); // Start detection only after the video is ready
          };
        }
      } catch (error) {
        console.error("❌ Error starting video:", error);
      }
    };

    const detectFaces = async () => {
      if (!videoRef.current || !canvasRef.current || isCallingAPI) return;
      setIsCallingAPI(true); // Prevent multiple API calls

      // Check if video is loaded
      if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
        console.warn("⚠️ Video not loaded yet, retrying in 500ms...");
        setTimeout(detectFaces, 500); // Retry after 500ms
        return;
      }

      const displaySize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      };

      faceapi.matchDimensions(canvasRef.current, displaySize);

      const getAttendance = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptors();

        if (detections.length === 0) {
          console.warn("⚠️ No faces detected!");
        }

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvasRef.current.getContext("2d")?.clearRect(0, 0, displaySize.width, displaySize.height);

        // Draw face bounding box
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

        if (detections.length > 0) {
          // Get face descriptor (vector)
          const descriptor = detections[0].descriptor;

          // Send descriptor to backend for recognition
          fetch("/api/mark-attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descriptor, id }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                console.log("Matched student:", data);
                setStudentName(data.name);
                if (data?.error !== "") {
                  toast.error(data.error);
                } else if (data?.msg !== "") {
                  toast.dark(data.msg);
                }
              } else {
                setStudentName("Unknown");
              }
            })
            .catch((error) => console.error("❌ Error recognizing face:", error))
            .finally(() => setIsCallingAPI(false)); // Reset API call flag after completion

          // Get the most dominant mood
          const expressions: any = detections[0].expressions;
          const dominantMood = Object.keys(expressions).reduce((a, b) => (expressions[a] > expressions[b] ? a : b));
          setMood(dominantMood.charAt(0).toUpperCase() + dominantMood.slice(1)); // Capitalize first letter
        }
      };
      getAttendance();

      if (!videoRef.current || !canvasRef.current) return;

      // Clear any existing interval
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }

      // Start a new interval
      intervalId.current = setInterval(() => {
        getAttendance();
      }, 4000);
    };

    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    };

    loadModels().then(() => {
      startVideo();
      detectFaces();
    });
  }, []);

  return (
    <div className="relative">
      <video ref={videoRef} autoPlay playsInline className="border" width={640} height={300} />
      <canvas ref={canvasRef} className="absolute left-0 top-0" />
      <div className="p-4">
        <p className="text-lg font-bold">Name: {studentName}</p>
        <p className="text-md">Mood: {mood}</p>
      </div>
    </div>
  );
};

export default FaceRecognition;
