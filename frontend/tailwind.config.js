/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#E7E4DC",
        "paper-deep": "#DCD8CD",
        surface: "#F4F2EC",
        ink: "#17171C",
        "ink-soft": "#56565E",
        "ink-faint": "#8A8880",
        line: "#CFCBC0",
        signal: "#2A27D6",
        "signal-deep": "#16158A",
        up: "#15734A",
        down: "#C23A2B",
        warn: "#9A6B00",
      },
      fontFamily: {
        display: ['"Bodoni Moda"', "Georgia", "serif"],
        sans: ['"Archivo"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
      boxShadow: {
        panel: "0 1px 0 #FBFAF6 inset, 0 1px 2px rgba(23,23,28,0.04)",
        lift: "0 18px 40px -24px rgba(23,23,28,0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "draw-flow": {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
