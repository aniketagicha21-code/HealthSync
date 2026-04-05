/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "system-ui", "sans-serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          950: "#10151c",
          900: "#161c26",
          850: "#1c2430",
          800: "#232d3a",
        },
        mist: "#a8b2bf",
        linen: "#ebe6de",
        sage: {
          DEFAULT: "#6d9a87",
          light: "#8eb5a3",
          dark: "#4f7564",
        },
        gold: {
          DEFAULT: "#c4a574",
          muted: "#9e8559",
        },
        trust: "#8aa9bc",
        rose: {
          soft: "#d4847a",
          deep: "#b85c52",
        },
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(ellipse 90% 70% at 10% -10%, rgba(139, 92, 246, 0.18), transparent 50%), radial-gradient(ellipse 70% 60% at 90% 0%, rgba(6, 182, 212, 0.14), transparent 45%), radial-gradient(ellipse 55% 50% at 50% 100%, rgba(244, 114, 182, 0.1), transparent 50%)",
        "mesh-dark":
          "radial-gradient(ellipse 80% 60% at 20% -5%, rgba(139, 92, 246, 0.22), transparent 55%), radial-gradient(ellipse 60% 50% at 95% 15%, rgba(6, 182, 212, 0.12), transparent 50%), radial-gradient(ellipse 70% 55% at 50% 100%, rgba(99, 102, 241, 0.08), transparent 55%), linear-gradient(180deg, #0c0d12 0%, #08090c 45%, #0a0b10 100%)",
      },
      boxShadow: {
        lift: "0 24px 80px -24px rgba(0,0,0,0.12)",
        "lift-dark": "0 24px 80px -24px rgba(0,0,0,0.55)",
        card: "0 0 0 1px rgba(0,0,0,0.04), 0 12px 40px -12px rgba(0,0,0,0.08)",
        "card-dark":
          "0 0 0 1px rgba(255,255,255,0.06), 0 20px 50px -20px rgba(0,0,0,0.5)",
        "critical-glow":
          "0 0 0 1px rgba(248,113,113,0.4), 0 0 28px rgba(220,38,38,0.35)",
      },
      animation: {
        drift: "drift 22s ease-in-out infinite",
        shimmer: "shimmer 2.5s ease-in-out infinite",
        "pulse-critical": "pulse-critical 2.2s ease-in-out infinite",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(-2%, 1%) scale(1.02)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "pulse-critical": {
          "0%, 100%": {
            boxShadow:
              "0 0 0 1px rgba(248,113,113,0.45), 0 0 18px rgba(220,38,38,0.3)",
            opacity: "1",
          },
          "50%": {
            boxShadow:
              "0 0 0 1px rgba(248,113,113,0.65), 0 0 32px rgba(220,38,38,0.55)",
            opacity: "0.92",
          },
        },
      },
    },
  },
  plugins: [],
};
