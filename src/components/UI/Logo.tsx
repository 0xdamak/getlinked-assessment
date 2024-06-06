import { clsx } from "clsx";
import Link from "next/link";
import LogoIcon from "@/public/svgs/logo.svg";

interface Props {
  className?: string;
}

export default function Logo({ className }: Props): JSX.Element {
  return (
    <Link href="/">
      <LogoIcon className={clsx("", className)} />
    </Link>
  );
}
