"use client";

import { motion } from "framer-motion";
import { useCountdownTimer } from "@/src/hooks/useCountdownTimer";
import Logo from "./Logo";
import EyeOpenIcon from "@/public/svgs/eye-open.svg";

export default function TopNav(): JSX.Element {
  const { minutes, seconds } = useCountdownTimer(30, 0);

  return (
    <header className="flex items-center bg-gl-white p-4 sm:h-24">
      <nav className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 overflow-hidden sm:flex-row">
        <div className="mr-auto flex items-center gap-4">
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }}>
            <Logo className="" />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-base text-gl-black sm:text-xl">
              Frontend developer
            </h1>
            <p className="text-sm text-gl-gray-500">Skill assessment test</p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex w-full items-center gap-3 sm:w-auto"
        >
          <div className="flex h-11 w-full items-center justify-center rounded-lg bg-gl-purple-100 sm:w-44">
            <h1 className="text-lg font-bold text-gl-indigo-600">
              {minutes}:{seconds}{" "}
              <span className="text-sm font-medium">time left</span>
            </h1>
          </div>
          <div className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-gl-purple-100">
            <EyeOpenIcon />
          </div>
        </motion.div>
      </nav>
    </header>
  );
}
