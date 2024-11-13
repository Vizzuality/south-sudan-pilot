import defaultTheme from "tailwindcss/defaultTheme";
import TailwindAnimate from "tailwindcss-animate";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TailwindBorderImage from "tailwindcss-border-image";

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
      gray: {
        "500": "#60626A",
      },
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
        "800": "#424B8B",
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
      fontSize: {
        "2xs": ["10px", "16px"],
      },
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
      // From https://github.com/shadcn-ui/ui/issues/2053#issuecomment-1902542088
      keyframes: {
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
      },
    },
  },
  extend: {},
  plugins: [TailwindAnimate, TailwindBorderImage],
};

export default config;
