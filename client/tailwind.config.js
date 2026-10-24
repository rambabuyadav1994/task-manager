/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#172033",
        muted: "#68738a",
        canvas: "#f5f7fb",
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#5b67e8",
          600: "#4b55d4",
          700: "#3c45b5",
        },
      },
      boxShadow: {
        panel: "0 8px 28px rgba(31, 42, 74, 0.06)",
      },
    },
  },
  plugins: [],
};
