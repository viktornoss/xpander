import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Pure black and luxury monochrome system
        xpander: {
          950: "#000000",
          900: "#050505",
          850: "#0a0a0a",
          800: "#121212",
          700: "#1c1c1c",
          600: "#2a2a2a",
        },
        nexus: {
          950: "#000000",
          900: "#050505",
          850: "#0a0a0a",
          800: "#121212",
          700: "#1c1c1c",
          600: "#2a2a2a",
        },
        // Monochromatic accents with subtle silver/white high contrast
        neon: {
          blue: "#ffffff",
          purple: "#e4e4e7",
          indigo: "#d4d4d8",
          cyan: "#f4f4f5",
          violet: "#a1a1aa",
          emerald: "#10b981", // kept for real success indicators
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow": "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 40%, transparent 70%)",
        "card-glow": "linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
      boxShadow: {
        "neon-blue": "0 0 25px -5px rgba(255, 255, 255, 0.25)",
        "neon-purple": "0 0 25px -5px rgba(255, 255, 255, 0.2)",
        "neon-cyan": "0 0 25px -5px rgba(255, 255, 255, 0.2)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.6)",
        "elevated": "0 20px 40px -15px rgba(0, 0, 0, 0.9), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { opacity: "0.3", filter: "blur(20px)" },
          "100%": { opacity: "0.6", filter: "blur(30px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
