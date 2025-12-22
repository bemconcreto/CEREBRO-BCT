/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bc: {
          black: "#1E1E1E",
          dark: "#111111",
          gold: "#C9A24D",
          goldSoft: "#E6D7A3",
          bg: "#F5F4F1",
          text: "#2A2A2A",
          muted: "#7A7A7A",
          border: "#E2E2E2",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        sidebar: "2px 0 12px rgba(0,0,0,0.08)",
        card: "0 4px 20px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};