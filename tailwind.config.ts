import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        /* Main Theme */
        background: "#FDF8F1",
        foreground: "#2B2118",

        /* Cards */
        card: "#FFFFFF",
        "card-hover": "#FFF7EA",

        /* Primary Accent */
        accent: "#D9A52D",
        "accent-light": "#E6B84B",
        "accent-dark": "#B87412",

        /* Extra Colors */
        cream: "#F8EFE2",
        gold: "#B87412",
        bronze: "#8A5A08",

        /* Text */
        muted: "#7D6C5B",
        "muted-light": "#A89480",

        /* Borders */
        border: "#EAD9C1",

        /* Storefront palette (public site) */
        dum: { DEFAULT: "#0E3B2F", deep: "#082A21", soft: "#15503F" },
        brass: { DEFAULT: "#C9A24B", light: "#E2C47E", dark: "#9A7A2E" },
        kesar: "#E8912D",
        ivory: { DEFAULT: "#FBF5E9", dim: "#F1E7D2" },
        ink: "#1F2A24",
        leaf: "#2E8B3E",
        chilli: "#B3261E",

        /* Utility */
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },

      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],

        heading: [
          "Playfair Display",
          "Georgia",
          "serif",
        ],

        display: ['"Rozha One"', "Georgia", "serif"],
        body: ["Mukta", "system-ui", "-apple-system", '"Segoe UI"', "sans-serif"],

        playfair: [
          "Playfair Display",
          "serif",
        ],
      },

      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
          xl: "2rem",
          "2xl": "2rem",
        },
      },

      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        "2xl": "32px",
        full: "9999px",
      },

      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.05)",
        hover: "0 20px 50px rgba(0,0,0,0.10)",
        gold: "0 10px 30px rgba(217,165,45,0.20)",
      },

      backgroundImage: {
        hero: "linear-gradient(180deg,#FFFDF9 0%,#F8EFE2 100%)",
        gold: "linear-gradient(135deg,#B87412 0%,#D9A52D 100%)",
        cream: "linear-gradient(180deg,#FFFFFF 0%,#FDF8F1 100%)",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      animation: {
        fade: "fade 0.6s ease forwards",
        float: "float 4s ease-in-out infinite",
        steam: "steam 6s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
      },

      keyframes: {
        fade: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        steam: {
          "0%": { transform: "translateY(10px) scaleX(1)", opacity: "0" },
          "30%": { opacity: ".55" },
          "100%": { transform: "translateY(-120px) scaleX(1.6)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },

        float: {
          "0%,100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-8px)",
          },
        },
      },
    },
  },

  plugins: [],
};

export default config;