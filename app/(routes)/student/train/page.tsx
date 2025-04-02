"use client";
import * as faceapi from "face-api.js";
import { useState, useEffect } from "react";

const TrainFace = () => {
  const [images, setImages] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    const userObj = JSON.parse(user!);
    setUser(userObj);
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };
    loadModels();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const trainFace = async () => {
    try {
      setStatus("Processing...");
      const faceDescriptors = [];

      for (const img of images) {
        const image = await faceapi.bufferToImage(img);
        const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();

        if (detection) {
          faceDescriptors.push({
            descriptor: Array.from(detection.descriptor),
          });
        }
      }

      // Send descriptors to the backend
      const response = await fetch("/api/train-face", {
        method: "POST",
        body: JSON.stringify({ descriptors: faceDescriptors, email: user.email }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setStatus("Face trained successfully!");
      } else {
        setStatus("Failed to train face.");
      }
    } catch (error) {
      console.error("Error training face:", error);
      setStatus("Failed to train face.");
    }
  };

  return (
    <div>
      <h2>Train Face</h2>
      <input type="file" multiple onChange={handleFileUpload} />
      <button onClick={trainFace}>Train</button>
      <p>{status}</p>
    </div>
  );
};

export default TrainFace;
