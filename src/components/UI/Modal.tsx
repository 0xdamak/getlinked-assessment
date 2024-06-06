import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  title?: string;
  className?: string;
  display: boolean;
  close: () => void;
}

const Modal = ({
  title,
  children,
  display,
  close,
  className,
}: Props): JSX.Element => {
  useEffect(() => {
    const html = document.querySelector("html");
    if (display && html !== null) {
      html.style.overflow = "hidden";
    }
    if (!display && html !== null) {
      html.style.removeProperty("overflow");
    }
  }, [display]);

  return (
    <AnimatePresence>
      {display && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: "tween", duration: 0.2 }}
            onClick={close}
            className="fixed left-0 top-0 z-30 flex h-screen w-screen items-center justify-center bg-gl-black/40"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ type: "tween", duration: 0.2 }}
              className={clsx(
                "flex h-full max-h-[314px] w-full max-w-[472px] shrink-0 flex-col overflow-hidden rounded-2xl bg-gl-white",
                className,
              )}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {title && (
                <div className="flex h-16 items-center justify-between gap-4 bg-gl-indigo-600 px-6 py-5">
                  <h1 className="text-base font-medium text-gl-white">
                    {title}
                  </h1>
                  <button
                    onClick={close}
                    className="rounded-lg bg-gl-purple-50/20 px-6 py-2 text-xs text-gl-white"
                  >
                    Close
                  </button>
                </div>
              )}
              <div className="h-full">{children}</div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
