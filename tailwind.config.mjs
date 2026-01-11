/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        accent: "#D4AF37", // Gold
        primary: "#000000", // Black
        secondary: "#FFFFFF", // White
      },
      fontFamily: {
        serif: ['"Grift"', "serif"],
        sans: ['"Grift"', "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem", // Ensuring 2xl is what we want, typically 1rem or 1.5rem
      },
    },
  },
  plugins: [],
};
