import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        foodie: {
          bg: "#0B0B0E",
          dark: "#101014",
          card: "#16161B",
          "card-hover": "#1E1E26",
          border: "#25252E",
          "border-hover": "#3C3C48",
          yellow: "#FFC20E",
          "yellow-hover": "#E5AC00",
          gold: "#EAB308",
          accent: "#FBBF24",
          muted: "#9CA3AF",
        },
        brand: {
          yellow: "#FFC20E",
          "yellow-hover": "#E5AC00",
          red: "#D92323",
          "red-hover": "#BA1B1B",
          charcoal: "#0B0B0E",
          "charcoal-card": "#16161B",
          "charcoal-muted": "#25252E",
          cream: "#F7F5EF",
          "cream-card": "#FFFFFF",
          "cream-border": "#E8E2D5",
          green: "#10B981",
          "green-hover": "#059669",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
        serif: ["Cinzel", "Playfair Display", "serif"],
        script: ["Caveat", "Brush Script MT", "cursive"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        "card-hover": "0 12px 30px -4px rgba(0, 0, 0, 0.7)",
        "gold-glow": "0 0 25px -4px rgba(255, 194, 14, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
