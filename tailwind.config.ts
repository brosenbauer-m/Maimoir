import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light warm background palette
        background: "#FAFAF8",
        surface: "#FFFFFF",
        card: "#FFFFFF",
        // Warm accent colors
        accent: "#D97706", // warm amber
        "accent-light": "#F59E0B",
        "accent-subtle": "#FEF3C7",
        "accent-tint": "#FFFBEB",
        // Typography colors for light theme
        "text-primary": "#1F2937",
        "text-secondary": "#6B7280",
        "text-muted": "#9CA3AF",
        // Borders and dividers
        border: "#E8E5E0",
        "border-light": "#F0EDE8",
        // Status colors
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        // Privacy badge colors
        "badge-public": "#10b981",
        "badge-discoverable": "#3b82f6",
        "badge-private": "#6b7280",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
export default config;
