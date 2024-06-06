import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      "gl-black": "#000000",
      "gl-white": "#FFFFFF",
      "gl-gray": {
        100: "#F8F9FB",
        500: "#8C8CA1",
        800: "#4A4A68",
        900: "#0E0E2C",
      },
      "gl-purple": {
        50: "#F5F3FF",
        100: "#ECE8FF",
      },
      "gl-indigo": {
        600: "#755AE2",
        700: "#675E8B",
      },
      "gl-orange": {
        500: "#FF5F56",
      },
    },
    extend: {},
  },
  plugins: [],
};
export default config;
