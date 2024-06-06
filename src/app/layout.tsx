import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import TopNav from "../components/UI/TopNav";
import "../styles/globals.css";
import clsx from "clsx";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Getlinked Assessment",
  description: "Developed by Damak",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/svgs/logo.svg" sizes="any" />
      </head>
      <body className={clsx(dmSans.className, "h-screen bg-gl-gray-100")}>
        <TopNav />
        <main className="mx-auto max-w-7xl p-4">{children}</main>
        <footer className="fixed bottom-2 left-2 sm:bottom-8 sm:left-8">
          <h1 className="text-sm font-normal text-gl-gray-500">
            POWERED BY{" "}
            <span className="text-gl-gray-900 text-lg">Getlinked.AI</span>
          </h1>
        </footer>
      </body>
    </html>
  );
}
