"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ObjectDetection from "../components/ObjectDetection";
import PageLoader from "../components/UI/PageLoader";

export default function Home(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto my-4 max-w-[832px] rounded-[20px] bg-gl-white p-4 sm:p-12"
    >
      <h1 className="mb-4 text-xl text-gl-black">System check</h1>
      <p className="text-sm font-normal leading-5 text-gl-gray-800">
        We utilize your camera image to ensure fairness for all participants,
        and we also employ both your camera and microphone for a video questions
        where you will be prompted to record a response using your camera or
        webcam, so it&apos;s essential to verify that your camera and microphone
        are functioning correctly and that you have a stable internet
        connection. To do this, please position yourself in front of your
        camera, ensuring that your entire face is clearly visible on the screen.
        This includes your forehead, eyes, ears, nose, and lips. You can
        initiate a 5-second recording of yourself by clicking the button below.
      </p>
      <ObjectDetection />
    </motion.div>
  );
}
