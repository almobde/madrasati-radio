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
        // 🎨 ألوان الإذاعة الإبداعية - Creative Radio Colors
        radio: {
          coral: "hsl(var(--radio-coral))",
          mint: "hsl(var(--radio-mint))",
          gold: "hsl(var(--radio-gold))",
          navy: "hsl(var(--radio-navy))",
        },
        boys: {
          primary: "hsl(var(--boys-primary))",
          secondary: "hsl(var(--boys-secondary))",
          accent: "hsl(var(--boys-accent))",
          gradient: "var(--boys-gradient)",
        },
        girls: {
          primary: "hsl(var(--girls-primary))",
          secondary: "hsl(var(--girls-secondary))",
          accent: "hsl(var(--girls-accent))",
          gradient: "var(--girls-gradient)",
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
        'gradient-sunrise': 'var(--gradient-sunrise)',
        'gradient-ocean': 'var(--gradient-ocean)',
        'gradient-warm': 'var(--gradient-warm)',
        'gradient-subtle': 'var(--gradient-subtle)',
        'gradient-hero': 'var(--gradient-hero)',
        'boys-gradient': 'var(--boys-gradient)',
        'girls-gradient': 'var(--girls-gradient)',
      },
      boxShadow: {
        'elegant': '0 15px 50px -10px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 40px rgba(var(--primary-rgb), 0.4)',
        'card': '0 8px 30px -5px rgba(0, 0, 0, 0.1)',
        'radio': '0 20px 60px -10px rgba(22, 160, 177, 0.25)',
        'coral': '0 15px 40px -5px rgba(248, 113, 113, 0.3)',
        'gold': '0 10px 35px -5px rgba(251, 191, 36, 0.4)',
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
