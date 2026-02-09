/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Bebas Neue", "Arial", "sans-serif"],
        body: ["Source Serif 4", "Georgia", "serif"],
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
        editorial: "0 12px 30px -16px hsl(var(--foreground) / 0.45)",
        "card-hover": "0 16px 40px -12px hsl(var(--foreground) / 0.18)",
        "drag-lift": "0 20px 50px -10px hsl(var(--foreground) / 0.30)",
        sidebar: "4px 0 24px -6px hsl(var(--foreground) / 0.12)",
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
      },
      animation: {
        "slide-in-left": "slide-in-left 0.25s ease-out",
        "fade-up": "fade-up 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line global-require
    require("tailwindcss-animate"),
  ],
};
