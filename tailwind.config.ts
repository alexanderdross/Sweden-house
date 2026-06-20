import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bohuslän coastal palette: deep sea blue, weathered granite, sand.
        sea: {
          50: "#f1f6f9",
          100: "#dce9f0",
          200: "#bdd5e3",
          300: "#90b8cf",
          400: "#5d93b4",
          500: "#3d7499",
          600: "#305d80",
          700: "#2a4d68",
          800: "#274157",
          900: "#24384b",
          950: "#152330",
        },
        sand: {
          50: "#faf7f1",
          100: "#f1e9d9",
          200: "#e3d2b4",
          300: "#d2b487",
          400: "#c39763",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
