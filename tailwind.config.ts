// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#FFCA2C",
        text: "#1E1E1E",
        // keep default white/black; your CSS variables still apply elsewhere
      },
      borderRadius: {
        "2xl": "1rem",
      },
      boxShadow: {
        // aligns with your custom utilities
        soft: "0 10px 40px -15px rgba(0,0,0,0.1)",
        subtle: "0 2px 10px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
}
export default config
