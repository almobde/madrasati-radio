import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          dark: "hsl(var(--primary-dark))",
          light: "hsl(var(--primary-light))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        boys: {
          primary: "hsl(var(--boys-primary))",
          "primary-dark": "hsl(var(--boys-primary-dark))",
          "primary-light": "hsl(var(--boys-primary-light))",
          secondary: "hsl(var(--boys-secondary))",
          accent: "hsl(var(--boys-accent))",
          gradient: "var(--boys-gradient)",
          "gradient-subtle": "var(--boys-gradient-subtle)",
        },
        girls: {
          primary: "hsl(var(--girls-primary))",
          "primary-dark": "hsl(var(--girls-primary-dark))",
          "primary-light": "hsl(var(--girls-primary-light))",
          secondary: "hsl(var(--girls-secondary))",
          accent: "hsl(var(--girls-accent))",
          gradient: "var(--girls-gradient)",
          "gradient-subtle": "var(--girls-gradient-subtle)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        'arabic': ['Cairo', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
        'heading': ['Amiri', 'Cairo', 'serif'],
        'body': ['Noto Sans Arabic', 'Cairo', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'boys-gradient': 'var(--boys-gradient)',
        'girls-gradient': 'var(--girls-gradient)',
        'boys-gradient-subtle': 'var(--boys-gradient-subtle)',
        'girls-gradient-subtle': 'var(--girls-gradient-subtle)',
      },
      boxShadow: {
        'elegant': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 30px rgba(var(--primary-rgb), 0.3)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
