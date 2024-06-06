"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";
import Link, { type LinkProps } from "next/link";

type Type = "button" | "submit" | "reset" | "link";
type BaseButtonTypeProps = HTMLMotionProps<"button">;
type BaseLinkTypeProps = LinkProps;

type BaseButtonProps = {
  type?: Type;
  text: string;
  loading?: boolean;
  className?: string;
} & (BaseButtonTypeProps | BaseLinkTypeProps);

const motionProps = {
  initial: {
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },
  whileHover: { scale: 1.01, boxShadow: "0 12px 18px -3px rgb(0 0 0 / 0.1)" },
  whileTap: { scale: 0.99, boxShadow: "0 8px 12px -2px rgb(0 0 0 / 0.1)" },
};

export function BaseButton({
  type,
  text,
  className,
  loading,
  ...props
}: BaseButtonProps): JSX.Element {
  const classes = clsx(
    "flex h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-gl-white bg-gl-indigo-600 disabled:bg-gl-gray-800 disabled:cursor-not-allowed",
    className,
  );
  if (type === "link") {
    return (
      <Link
        {...(props as BaseLinkTypeProps)}
        {...motionProps}
        className={classes}
      >
        {text}
      </Link>
    );
  }

  return (
    <motion.button
      {...motionProps}
      {...(props as BaseButtonTypeProps)}
      type={type}
      className={classes}
    >
      {text}
    </motion.button>
  );
}
