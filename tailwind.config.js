/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border: "rgba(255, 255, 255, 0.1)",
        input: "hsl(var(--input))",
        ring: "#34D399",
        background: "#000000",
        foreground: "#FFFFFF",
        emerald: {
          DEFAULT: "#34D399",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
        zinc: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
          950: "#09090B",
        },
        primary: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#18181B",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#27272A",
          foreground: "#71717A",
        },
        accent: {
          DEFAULT: "#34D399",
          foreground: "#000000",
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          foreground: "#FFFFFF",
        },
        dark: {
          900: "#000000",
          800: "#0A0A0A",
          700: "#141414",
        },
        // Legacy accent colors for compatibility
        'accent-primary': "#34D399",
        'accent-secondary': "#10B981",
        'accent-glow': "#34D399",
      },
      borderRadius: {
        '4xl': '2.5rem',
        '3xl': '1.5rem',
        '2xl': '1rem',
        xl: "0.75rem",
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      boxShadow: {
        glow: "0 0 40px rgba(52, 211, 153, 0.2)",
        "glow-lg": "0 0 60px rgba(52, 211, 153, 0.3)",
        "glow-sm": "0 0 20px rgba(52, 211, 153, 0.15)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(52, 211, 153, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(52, 211, 153, 0.4)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
