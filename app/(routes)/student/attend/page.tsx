"use client";
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const FaceRecognition = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [studentName, setStudentName] = useState("Unknown");
  const [mood, setMood] = useState("Neutral");

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
      if (!videoRef.current || !canvasRef.current) return;

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

      setInterval(async () => {
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
            body: JSON.stringify({ descriptor }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                console.log("Matched student:", data.name);
                setStudentName(data.name);
              } else {
                setStudentName("Unknown");
              }
            })
            .catch((error) => console.error("Error recognizing face:", error));

          // Get the most dominant mood
          const expressions: any = detections[0].expressions;
          const dominantMood = Object.keys(expressions).reduce((a, b) => (expressions[a] > expressions[b] ? a : b));
          setMood(dominantMood.charAt(0).toUpperCase() + dominantMood.slice(1)); // Capitalize first letter
        }
      }, 2000);
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
      <video ref={videoRef} autoPlay playsInline className="border" width={400} height={300} />
      <canvas ref={canvasRef} className="absolute top-0 left-0" />
      <div className="p-4">
        <p className="font-bold text-lg">Name: {studentName}</p>
        <p className="text-md">Mood: {mood}</p>
      </div>
    </div>
  );
};

export default FaceRecognition;

// "use client";
// import React, { useRef, useEffect, useState } from "react";
// import * as faceapi from "face-api.js";

// const FaceRecognition = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [studentName, setStudentName] = useState("Unknown");
//   const [mood, setMood] = useState("Neutral");

//   useEffect(() => {
//     const startVideo = async () => {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) videoRef.current.srcObject = stream;
//     };

//     const detectFaces = async () => {
//       if (!videoRef.current || !canvasRef.current) return;

//       const displaySize = {
//         width: videoRef.current.videoWidth,
//         height: videoRef.current.videoHeight,
//       };

//       faceapi.matchDimensions(canvasRef.current, displaySize);

//       setInterval(async () => {
//         if (!videoRef.current || !canvasRef.current) return;

//         const detections = await faceapi
//           .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
//           .withFaceLandmarks()
//           .withFaceExpressions()
//           .withFaceDescriptors();

//         const resizedDetections = faceapi.resizeResults(detections, displaySize);
//         canvasRef.current.getContext("2d")?.clearRect(0, 0, displaySize.width, displaySize.height);

//         // Draw face bounding box
//         faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

//         // Get the most dominant expression
//         if (detections.length > 0) {
//           const expressions: any = detections[0].expressions;
//           const dominantMood = Object.keys(expressions).reduce((a, b) => (expressions[a] > expressions[b] ? a : b));
//           setMood(dominantMood.charAt(0).toUpperCase() + dominantMood.slice(1)); // Capitalize first letter
//         }
//       }, 1000);
//     };

//     const loadModels = async () => {
//       await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
//       await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
//       await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
//     };

//     loadModels().then(() => {
//       startVideo();
//       detectFaces();
//     });
//   }, []);

//   return (
//     <div className="relative">
//       <video ref={videoRef} autoPlay playsInline className="border" width={400} height={300} />
//       <canvas ref={canvasRef} className="absolute top-0 left-0" />
//       {/* <button onClick={markAttendance}>Mark Attendance</button> */}
//       <div className="p-4">
//         <p className="font-bold text-lg">Name: {studentName}</p>
//         <p className="text-md">Mood: {mood}</p>
//       </div>
//     </div>
//   );
// };

// export default FaceRecognition;
