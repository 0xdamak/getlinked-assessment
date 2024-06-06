import { useState, useEffect } from "react";

interface Value {
  minutes: string;
  seconds: string;
}
export function useCountdownTimer(
  initialMinutes = 0,
  initialSeconds = 0,
): Value {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  function formatTime(time: number): string {
    return time.toString().padStart(2, "0");
  }
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      }
    }, 1000);

    if (minutes === 0 && seconds === 0) {
      clearInterval(timerInterval);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [minutes, seconds]);

  return { minutes: formatTime(minutes), seconds: formatTime(seconds) };
}
