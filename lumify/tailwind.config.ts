import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        brand: {
          DEFAULT: "#4f46e5",
          fg: "#ffffff",
          soft: "#eef2ff",
          ring: "#c7d2fe",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgb(0 0 0 / 0.04), 0 1px 8px rgb(0 0 0 / 0.04)",
        pop: "0 8px 30px rgb(0 0 0 / 0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
