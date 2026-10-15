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
        brand: {
          yellow: "#F9D817",
          "yellow-hover": "#E6C60F",
          red: "#D92323",
          "red-hover": "#BA1B1B",
          charcoal: "#171714",
          "charcoal-card": "#21211C",
          "charcoal-muted": "#2C2C26",
          cream: "#F7F4EC",
          "cream-card": "#FFFFFF",
          "cream-border": "#E8E2D3",
          green: "#235A36",
          "green-hover": "#1C4A2C",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(23, 23, 20, 0.08)",
        "card-hover": "0 10px 25px -3px rgba(23, 23, 20, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
