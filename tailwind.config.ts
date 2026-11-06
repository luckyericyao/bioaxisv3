import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bioaxis: {
          black: "#ffffff",
          panel: "#ffffff",
          panelSoft: "#f7fafb",
          line: "#d8e2e8",
          text: "#18212b",
          muted: "#52616f",
          dim: "#52616f",
          accent: "#245b78",
          ice: "#38bdf8",
          trust: "#10b981",
          trustSoft: "#dff8ee",
          steel: "#1f2937"
        }
      },
      fontFamily: { sans: ["var(--font-inter)", "Arial", "sans-serif"] },
      fontSize: { xs: ["14px", "21px"], sm: ["14px", "21px"], base: ["16px", "25px"] },
      fontWeight: { bold: "600", extrabold: "600", black: "600" },
      boxShadow: {
        search: "0 24px 80px rgba(15, 76, 129, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
