/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        accent: "#8B5CF6", // violet-500
        accent2: "#06B6D4", // cyan-500
        accent3: "#F59E0B", // amber-500
        surface: {
          DEFAULT: "#0B0B10",
          100: "#121218",
          200: "#181826",
        },
        text: {
          muted: "#9CA3AF",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
}

