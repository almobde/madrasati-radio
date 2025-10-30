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
        // 🏆 ألوان الإذاعة الفاخرة - Luxury Radio Colors
        radio: {
          gold: "hsl(var(--radio-gold))",      /* ذهبي أساسي */
          dark: "hsl(var(--radio-dark))",      /* رمادي داكن */
          light: "hsl(var(--radio-light))",    /* رمادي فاتح */
          accent: "hsl(var(--radio-accent))",  /* كحلي أنيق */
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
        'arabic': ['Tajawal', 'IBM Plex Sans Arabic', 'Almarai', 'system-ui', 'sans-serif'],
        'heading': ['Tajawal', 'Almarai', 'IBM Plex Sans Arabic', 'sans-serif'],
        'body': ['IBM Plex Sans Arabic', 'Tajawal', 'Almarai', 'system-ui', 'sans-serif'],
        'joyel': ['Cairo', 'Tajawal', 'IBM Plex Sans Arabic', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-dark': 'var(--gradient-dark)',
        'gradient-light': 'var(--gradient-light)',
        'gradient-subtle': 'var(--gradient-subtle)',
        'gradient-hero': 'var(--gradient-hero)',
        'boys-gradient': 'var(--boys-gradient)',
        'girls-gradient': 'var(--girls-gradient)',
      },
      boxShadow: {
        'elegant': '0 4px 12px -2px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 20px rgba(var(--primary-rgb), 0.3)',
        'card': '0 2px 8px -1px rgba(0, 0, 0, 0.06)',
        'radio': '0 8px 25px -5px rgba(218, 165, 32, 0.25)',     /* ذهبي */
        'luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',        /* أنيق */
        'soft': '0 2px 4px -1px rgba(0, 0, 0, 0.06)',            /* ناعم */
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
