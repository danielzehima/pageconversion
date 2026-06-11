import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette chaude / sépia pour la nostalgie
        sepia: {
          50: "#fbf8f3",
          100: "#f4ece0",
          200: "#e8d6bf",
          300: "#d9bb95",
          400: "#c79a68",
          500: "#b9824b",
          600: "#a86c3f",
          700: "#8b5536",
          800: "#724631",
          900: "#5f3b2b",
        },
        ink: {
          DEFAULT: "#1c1917",
          soft: "#44403c",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
