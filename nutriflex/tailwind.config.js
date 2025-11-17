export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#E50914",
          black: "#0e0e0e",
          gray: "#1f1f1f",
        },
      },
      boxShadow: {
        soft: "0 10px 25px -10px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};