/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["DM Sans", "system-ui", "sans-serif"],
        body: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          muted: "hsl(var(--sidebar-muted))",
          "muted-foreground": "hsl(var(--sidebar-muted-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
        },
        stage: {
          submitted: "hsl(var(--stage-submitted))",
          review: "hsl(var(--stage-review))",
          accepted: "hsl(var(--stage-accepted))",
          progress: "hsl(var(--stage-progress))",
          closing: "hsl(var(--stage-closing))",
          closed: "hsl(var(--stage-closed))",
          declined: "hsl(var(--stage-declined))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        elevated:
          "0 1px 2px hsl(0 0% 0% / 0.4), 0 4px 16px -2px hsl(0 0% 0% / 0.3)",
        glass:
          "inset 0 1px 0 0 hsl(0 0% 100% / 0.04), 0 1px 2px hsl(0 0% 0% / 0.3)",
        "glow-sm": "0 0 12px -2px hsl(174 72% 46% / 0.3)",
        "glow-lg": "0 0 24px -4px hsl(174 72% 46% / 0.4)",
        "card-hover":
          "0 0 0 1px hsl(174 72% 46% / 0.12), 0 8px 32px -8px hsl(0 0% 0% / 0.4)",
        "drag-lift":
          "0 20px 50px -10px hsl(0 0% 0% / 0.5), 0 0 0 1px hsl(174 72% 46% / 0.2)",
        sidebar: "1px 0 0 0 hsl(var(--sidebar-border))",
      },
      letterSpacing: {
        poster: "0.08em",
      },
      keyframes: {
        "slide-in-left": {
          "0%": { transform: "translateX(-16px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-up": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "slide-in-left": "slide-in-left 0.25s ease-out",
        "fade-up": "fade-up 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        shimmer: "shimmer 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line global-require
    require("tailwindcss-animate"),
  ],
};
