import { useEffect, useState } from "react";

interface Value {
  camAccess: boolean;
  micAccess: boolean;
  internetSpeed: string;
  brightness: number;
  checkingNetwork: boolean;
  internetSpeedPercent: number;
  calculateBrightness: (video: HTMLVideoElement) => void;
}

const AVERAGE_SPEED_MEGABITS_PER_SECOND = 10;

export function useDeviceCheck(): Value {
  const [camAccess, setCamAccess] = useState(false);
  const [micAccess, setMicAccess] = useState(false);
  const [internetSpeed, setInternetSpeed] = useState<string>("");
  const [internetSpeedPercent, setInternetSpeedPercent] = useState<number>(0);
  const [brightness, setBrightness] = useState(0);
  const [checkingNetwork, setCheckingNetwork] = useState(false);

  function calculateBrightness(video: HTMLVideoElement): void {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      const imageData = ctx.getImageData(
        0,
        0,
        video.videoWidth,
        video.videoHeight,
      );
      const data = imageData.data;
      let totalBrightness = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;
        totalBrightness += brightness;
      }
      const avgBrightness =
        totalBrightness / (video.videoWidth * video.videoHeight);
      const brightnessPercentage = (avgBrightness / 255) * 100;
      setBrightness(brightnessPercentage);
    }
  }

  function calculateInternetSpeedPercent(speedMbps: number): number {
    const speedPercent = (speedMbps / AVERAGE_SPEED_MEGABITS_PER_SECOND) * 100;
    return Math.min(Math.max(speedPercent, 0), 100);
  }

  useEffect(() => {
    async function checkDevices(): Promise<void> {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setCamAccess(true);
        setMicAccess(true);
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (error) {
        console.log(error);
      }
    }
    void checkDevices();
  }, []);

  useEffect(() => {
    async function checkInternetSpeed(): Promise<void> {
      const image = new Image();
      const startTime = new Date().getTime();
      setCheckingNetwork(true);
      image.src =
        "https://sample-videos.com/img/Sample-jpg-image-5mb.jpg?rand=" +
        Math.random();
      image.onload = () => {
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000;
        const fileSize = 5 * 1024 * 1024;
        const speedMbps = (fileSize * 8) / (duration * 1024 * 1024);
        setInternetSpeed(speedMbps.toFixed(2));
        const speedPercent = calculateInternetSpeedPercent(speedMbps);
        setInternetSpeedPercent(speedPercent);
        setCheckingNetwork(false);
      };
      image.onerror = (error) => {
        console.error("Error loading image for speed test: ", error);
        setCheckingNetwork(false);
      };
    }
    void checkInternetSpeed();
  }, []);

  return {
    camAccess,
    micAccess,
    internetSpeed,
    internetSpeedPercent,
    brightness,
    checkingNetwork,
    calculateBrightness,
  };
}
