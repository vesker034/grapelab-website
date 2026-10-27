import type { Config } from "tailwindcss";
import tailwindcssRtl from "tailwindcss-rtl";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@premieroctet/next-admin/dist/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("@premieroctet/next-admin/preset")],
  theme: {
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1200px",
      xl: "1500px",
    },
    extend: {
      fontFamily: {
        sans: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "20px",
          lg: "80px",
        },
      },
      colors: {
        "light-cards": "var(--color-light-cards-text)",
        primary: "#58427C",
        accent: "#77C3DD",
        gradientStart: "#F2F4F7",
        gradientEnd: "#ECE7F3",
        background: "#F2F0F5",
        textPrimary: "#2B2B2B",
        textMuted: "#4C484B",
        textLight: "#E0E0E0",
        textWhite: "#FFFFFF",
        black: "#000000",
        borderLight: "#DADADA",
      },
    },
  },
  plugins: [tailwindcssRtl],
};
export default config;