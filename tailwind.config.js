/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "400px",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', ...defaultTheme.fontFamily.sans],
        display: ['"Bricolage Grotesque"', '"Instrument Sans"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Todos os pares texto/fundo usados abaixo atingem contraste AA (>= 4.5:1).
        ink: {
          DEFAULT: "#13201A", // texto principal (16:1 sobre canvas)
          soft: "#3A4741", // texto secundário forte
        },
        muted: "#56625C", // texto auxiliar (6:1 sobre branco)
        canvas: "#F7F6F1", // fundo da página
        surface: "#FFFFFF",
        line: {
          DEFAULT: "#E3E1D8",
          strong: "#8A948F", // bordas de campos (3:1 sobre branco)
        },
        brand: {
          50: "#ECF7F2",
          100: "#D2EEE1",
          200: "#A6DCC4",
          300: "#6FC3A1",
          500: "#14946A",
          600: "#0B7A56", // botões/links (5.3:1 com branco)
          700: "#075F43",
          800: "#064A35",
          900: "#04382A",
          950: "#022019",
        },
        primary: "#0B7A56",
        star: {
          DEFAULT: "#C26A00", // estrela preenchida (3.6:1 sobre branco)
          empty: "#D9D6CB",
        },
        cream: "#FFF3D6",
        danger: {
          DEFAULT: "#B42318", // 6.2:1 sobre branco
          soft: "#FEF3F2",
        },
        success: {
          DEFAULT: "#067647",
          soft: "#ECFDF3",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(19, 32, 26, 0.06), 0 1px 1px rgba(19, 32, 26, 0.04)",
        raised: "0 12px 32px -12px rgba(19, 32, 26, 0.22)",
      },
      maxWidth: {
        content: "76rem",
      },
      keyframes: {
        shimmer: {
          "0%": { opacity: "1" },
          "50%": { opacity: "0.55" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
