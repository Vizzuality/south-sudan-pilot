import defaultTheme from "tailwindcss/defaultTheme";
import TailwindAnimate from "tailwindcss-animate";

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontFamily: {
      sans: ["var(--font-jost)", ...defaultTheme.fontFamily.sans],
      serif: ["var(--font-dm-serif-text)", ...defaultTheme.fontFamily.serif],
    },
    colors: {
      white: "#ffffff",
      "casper-blue": {
        "50": "#f4f8fa",
        "200": "#d4e0e9",
        "300": "#b6cbda",
        "400": "#a4bdd0",
        "500": "#7999b8",
        "950": "#2b3340",
      },
      "rhino-blue": {
        "50": "#f3f5fb",
        "400": "#86a0d4",
        "500": "#6982c8",
        "900": "#38406e",
        "950": "#262a45",
      },
      "downy-green": {
        "300": "#67c3bf",
      },
      "supernova-yellow": {
        "300": "#ffe043",
        "400": "#ffcc15",
      },
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
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
    },
  },
  extend: {},
  plugins: [TailwindAnimate],
};

export default config;
