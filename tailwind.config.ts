import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bioaxis: {
          black: "#f8fafc",
          panel: "#ffffff",
          panelSoft: "#eef3f8",
          line: "#d7e1ea",
          text: "#111827",
          muted: "#475569",
          dim: "#64748b",
          accent: "#0f4c81",
          ice: "#38bdf8",
          trust: "#10b981",
          trustSoft: "#dff8ee",
          steel: "#1f2937"
        }
      },
      boxShadow: {
        search: "0 24px 80px rgba(15, 76, 129, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
