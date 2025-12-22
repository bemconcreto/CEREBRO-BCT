import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bc: {
          bg: "#d9d9d6",
          dark: "#101820",
          brown: "#7a5d53",
          brownDark: "#624b43",
          brownMid: "#564235",
          brownLight: "#4c3534",
          gold: "#C9A24D",
        },
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;