/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      satoshi: ["sans-serif"],
    },
    screens: {
      "2xsm": "375px",
      xsm: "425px",
      "3xl": "2000px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        current: "currentColor",
        transparent: "transparent",
        white: "#FFFFFF",
        black: "#1C2434",
        "black-2": "#010101",
        body: "#64748B",
        bodydark: "#AEB7C0",
        bodydark1: "#DEE4EE",
        bodydark2: "#8A99AF",
        primary: "#3C50E0",
        secondary: "#80CAEE",
        stroke: "#E2E8F0",
        "gray-light": "#EFF4FB",
        graydark: "#333A48",
        "gray-2": "#F7F9FC",
        whiten: "#F1F5F9",
        whiter: "#F5F7FD",
        boxdark: "#24303F",
        "boxdark-2": "#1A222C",
        strokedark: "#2E3A47",
        "form-strokedark": "#3d4d60",
        "form-input": "#1d2a39",
        success: "#219653",
        danger: "#D34053",
        warning: "#FFA70B",
        "meta-3": "#10B981",
        "meta-6": "#FFBA00",
      },
      boxShadow: {
        default: "0px 8px 13px -3px rgba(0, 0, 0, 0.07)",
        card: "0px 1px 3px rgba(0, 0, 0, 0.12)",
      },
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        7.5: "1.875rem",
        10.5: "2.625rem",
        12.5: "3.125rem",
        17.5: "4.375rem",
        22.5: "5.625rem",
      },
    },
  },
  plugins: [],
};
