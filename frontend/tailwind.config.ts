import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: "#fcfcfc",
        theme1: "#4063a7",
        theme2: "#4a70b9",
        theme3: "#547ecc",
        theme4: "#5e8cdf",
      },
      fontFamily: {
        montserratAlt1: ["MontserratAlt1", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
