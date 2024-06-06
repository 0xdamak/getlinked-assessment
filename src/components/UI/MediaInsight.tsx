import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CheckMarkIcon from "@/public/svgs/checkmark.svg";
import WarningIcon from "@/public/svgs/warning.svg";
import clsx from "clsx";

interface Props {
  title: string;
  icon: ReactNode;
  thumbnail: ReactNode;
  percent: number;
  minPercent: number;
  loading?: boolean;
}

export default function MediaInsight({
  icon,
  title,
  percent,
  thumbnail,
  minPercent,
  loading,
}: Props): JSX.Element {
  return (
    <div className="relative flex h-[71px] w-[91px] flex-col items-center justify-center gap-1 rounded-[10px] bg-gl-purple-50 p-2">
      <div
        className={clsx(
          "absolute right-0 top-0 m-1 flex h-4 w-4 items-center justify-center rounded-full transition-all",
          {
            "bg-gl-indigo-600": percent >= minPercent,
            "bg-gl-orange-500": percent < minPercent,
          },
        )}
      >
        {thumbnail}
      </div>
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gl-purple-100">
        {!loading && (
          <>
            {percent < 100 && (
              <>
                {percent >= minPercent ? (
                  icon
                ) : (
                  <WarningIcon className="shrink-0" />
                )}
                <CircularProgressBar
                  percent={percent}
                  minPercent={minPercent}
                />
              </>
            )}
            {percent === 100 && (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gl-indigo-600">
                <div className="flex h-[33px] w-[33px] items-center justify-center rounded-full border-2 border-gl-purple-100 bg-gl-indigo-600">
                  <CheckMarkIcon className="shrink-0" />
                </div>
              </div>
            )}
          </>
        )}
        {loading && (
          <svg
            aria-hidden="true"
            className="absolute inline h-4 w-4 animate-spin fill-gl-indigo-600 text-gl-gray-500"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        )}
      </div>
      <p className="text-center text-xs capitalize text-gl-gray-800">{title}</p>
    </div>
  );
}

function CircularProgressBar({
  percent = 0,
  minPercent,
}: Pick<Props, "percent" | "minPercent">): JSX.Element {
  const [circumference, setCircumference] = useState(0);
  const radius = 45;

  useEffect(() => {
    setCircumference(2 * Math.PI * radius);
  }, [radius]);

  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <AnimatePresence>
      {percent < 100 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute left-0 top-0 h-full w-full"
        >
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <circle
              className="stroke-gl-purple-100"
              strokeWidth="6"
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
            ></circle>
            <circle
              className={clsx("transition-all", {
                "stroke-gl-indigo-600": percent >= minPercent,
                "stroke-gl-orange-500": percent < minPercent,
              })}
              strokeWidth="6"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: "stroke-dashoffset 0.35s",
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
              }}
            ></circle>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
