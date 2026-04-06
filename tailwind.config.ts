import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px",
        sm: "768px",
        md: "1024px",
        lg: "1280px",
      },
      maxWidth: {
        content: "1280px",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        "bg-primary": "var(--bg-primary)",
        "bg-dark": "var(--bg-dark)",
        "bg-section-alt": "var(--bg-section-alt)",
        "bg-card": "var(--bg-card)",
        graphite: "var(--graphite)",
        charcoal: "var(--charcoal)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-light": "var(--text-light)",
        "text-muted-light": "var(--text-muted-light)",
        accent: "var(--accent)",
        "accent-secondary": "var(--accent-secondary)",
      },
      borderColor: {
        "border-light": "var(--border-light)",
        "border-dark": "var(--border-dark)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 20px 40px rgba(0, 0, 0, 0.12)",
        glow: "0 8px 32px var(--accent-glow)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
