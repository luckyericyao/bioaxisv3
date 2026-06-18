import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bioaxis: {
          black: "#020304",
          panel: "#090b0c",
          panelSoft: "#101315",
          line: "#23282b",
          text: "#f5f7f4",
          muted: "#a8b0ad",
          dim: "#68716e",
          accent: "#aee8dc",
          steel: "#d7dfdc"
        }
      },
      boxShadow: {
        search: "0 32px 120px rgba(0, 0, 0, 0.55)"
      }
    }
  },
  plugins: []
};

export default config;

