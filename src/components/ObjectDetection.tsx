"use client";

import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { useRef, useEffect, useState, useCallback } from "react";
import { useDeviceCheck } from "../hooks/useDeviceCheck";
import { BaseButton } from "./UI/Buttons";
import Spinner from "./UI/Spinner";
import clsx from "clsx";
import MediaInsight from "../components/UI/MediaInsight";
import WebCamIcon from "@/public/svgs/webcam.svg";
import WebCamMiniIcon from "@/public/svgs/webcam-mini.svg";
import WiFiIcon from "@/public/svgs/wifi.svg";
import WiFiMiniIcon from "@/public/svgs/wifi-mini.svg";
import MicrophoneMiniIcon from "@/public/svgs/microphone-mini.svg";
import LampIcon from "@/public/svgs/lamp.svg";
import LampMiniIcon from "@/public/svgs/lamp-mini.svg";
import Modal from "./UI/Modal";
import Image from "next/image";

const ObjectDetection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    camAccess,
    micAccess,
    internetSpeedPercent,
    brightness,
    checkingNetwork,
    calculateBrightness,
  } = useDeviceCheck();
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isPersonDetected, setIsPersonDetected] = useState(false);
  const [webCamPercent, setWebCamPercent] = useState(0);
  const [modalDisplay, setModalDisplay] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const detectFrame = useCallback(() => {
    if (videoRef.current && model) {
      model
        .detect(videoRef.current)
        .then((predictions) => {
          renderPredictions(predictions);
          videoRef.current && calculateBrightness(videoRef.current);
          requestAnimationFrame(detectFrame);
          const personDetected = predictions.some(
            (prediction) => prediction.class === "person",
          );
          setIsPersonDetected(personDetected);
        })
        .catch((error) => {
          console.error("Error detecting frame: ", error);
        });
    }
  }, [model]);

  const insights = [
    {
      title: "webcam",
      icon: <WebCamIcon className="shrink-0" />,
      thumbnail: <WebCamMiniIcon className="shrink-0" />,
      percent: webCamPercent,
      minPercent: 100,
    },
    {
      title: "speed",
      icon: <WiFiIcon className="shrink-0" />,
      thumbnail: <WiFiMiniIcon className="shrink-0" />,
      percent: internetSpeedPercent,
      minPercent: 10,
      loading: checkingNetwork,
    },
    {
      title: "gadget mic",
      icon: <WebCamIcon className="shrink-0" />,
      thumbnail: <MicrophoneMiniIcon className="shrink-0" />,
      percent: micAccess ? 100 : 0,
      minPercent: 100,
    },
    {
      title: "lighting",
      icon: <LampIcon className="shrink-0" />,
      thumbnail: <LampMiniIcon className="shrink-0" />,
      percent: brightness,
      minPercent: 20,
    },
  ];

  function checkValidity(): boolean {
    return insights.every((item) => item.percent >= item.minPercent);
  }

  function captureFrame(): void {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL("image/png"));
      }
    }
  }

  function renderPredictions(predictions: cocoSsd.DetectedObject[]): void {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && videoRef.current && canvasRef.current) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      predictions.forEach((prediction) => {
        const [x, y, width, height] = prediction.bbox;
        ctx.strokeStyle = "#00FFFF";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        ctx.fillStyle = "#00FFFF";
        ctx.font = "18px Arial";
        ctx.fillText(prediction.class, x, y);
      });
    }
  }

  useEffect(() => {
    async function loadModel(): Promise<void> {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    }
    void loadModel();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWebCamPercent(isPersonDetected && camAccess ? 100 : 0);
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, [isPersonDetected, camAccess]);

  useEffect(() => {
    async function setupCamera(): Promise<void> {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            void videoRef.current?.play();
            videoRef.current?.addEventListener("playing", () => {
              setIsVideoPlaying(true);
              if (videoRef.current) {
                videoRef.current.width = videoRef.current.videoWidth;
                videoRef.current.height = videoRef.current.videoHeight;
              }
              detectFrame();
            });
          };
        }
      } catch (error) {
        console.error("Error accessing webcam");
      }
    }

    if (model) {
      void setupCamera();
    }
  }, [detectFrame, model]);

  return (
    <>
      <div>
        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-center">
          <div className="h-60 w-full overflow-hidden rounded-[10px] border border-gl-indigo-600 sm:h-44 sm:w-72">
            <div className="relative size-full">
              <video
                ref={videoRef}
                className={clsx(
                  "absolute left-0 top-0 size-full object-cover",
                  {
                    hidden: !isVideoPlaying && !camAccess && !micAccess,
                  },
                )}
              />
              <canvas
                ref={canvasRef}
                className="absolute left-0 top-0 size-full"
              />
              {capturedImage && (
                <Image
                  src={capturedImage}
                  alt="Captured"
                  width={1000}
                  height={1000}
                  className="absolute left-0 top-0 size-full object-cover"
                />
              )}
              {!isVideoPlaying && camAccess && micAccess && <Spinner />}
              {!isVideoPlaying && (!camAccess || !micAccess) && (
                <div className="flex size-full items-center justify-center p-4">
                  <p className="text-center text-sm text-gl-gray-800">
                    Allow Camera and Microphone access
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="grid size-full max-w-52 grid-cols-2 gap-4 sm:w-auto">
            {insights.map((item) => (
              <MediaInsight
                key={item.title}
                title={item.title}
                icon={item.icon}
                thumbnail={item.thumbnail}
                percent={item.percent}
                minPercent={item.minPercent}
                loading={item.loading}
              />
            ))}
          </div>
        </div>
        <BaseButton
          text="Take picture and continue"
          onClick={() => {
            if (checkValidity()) {
              captureFrame();
              setModalDisplay(true);
              return;
            }
            alert("Please ensure all conditions are met.");
          }}
          className="mt-8"
        />
      </div>

      <Modal
        display={modalDisplay}
        title="Start assessment"
        close={() => {
          setModalDisplay(false);
          setCapturedImage(null);
        }}
      >
        <div className="flex size-full flex-col">
          <div className="flex size-full flex-col items-center justify-center bg-gl-purple-50">
            <h1 className="mb-1 text-center text-xl font-medium text-gl-indigo-600">
              Proceed to start assessment
            </h1>
            <p className="max-w-[335px] text-center text-sm font-normal text-gl-indigo-700">
              Kindly keep to the rules of the assessment and sit up, stay in
              front of your camera/webcam and start your assessment.
            </p>
          </div>
          <div className="rounded-md bg-gl-white px-6 py-4">
            <BaseButton
              text="Proceed"
              onClick={() => {
                alert("End of demo. Thank you!");
                setModalDisplay(false);
                setCapturedImage(null);
              }}
              className="ml-auto"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ObjectDetection;
