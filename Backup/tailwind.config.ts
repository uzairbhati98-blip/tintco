import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "var(--color-brand)",  // mustard gold
        text: "var(--color-text)",    // charcoal
        bg: "var(--color-bg)",        // white
      },
      borderRadius: {
        "2xl": "1rem",
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(0,0,0,.08)",
      },
    },
  },
  plugins: [],
}

export default config