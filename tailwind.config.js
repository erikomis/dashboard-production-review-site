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
        // Mesmo par tipográfico do dashboard: Inter no texto, Plus Jakarta Sans nos títulos.
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        display: ['"Plus Jakarta Sans"', "Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Paleta compartilhada com o dashboard (primary #3C50E0).
        // Todos os pares texto/fundo usados abaixo atingem contraste AA (>= 4.5:1).
        ink: {
          DEFAULT: "#1C2434", // texto principal (15:1 sobre canvas)
          soft: "#334155", // texto secundário forte
        },
        muted: "#556274", // texto auxiliar (6:1 sobre branco)
        canvas: "#F5F7FB", // fundo da página
        surface: "#FFFFFF",
        line: {
          DEFAULT: "#E2E8F0",
          strong: "#7A889C", // bordas de campos (3.6:1 sobre branco)
        },
        brand: {
          50: "#EEF1FE",
          100: "#DFE4FD",
          200: "#C3CBFB",
          300: "#98A5F6",
          500: "#4F63EA",
          600: "#3C50E0", // botões/links (6.2:1 com branco)
          700: "#3040B8",
          800: "#283590",
          900: "#1F2A6E",
          950: "#141B45",
        },
        primary: "#3C50E0",
        star: {
          DEFAULT: "#D97706", // estrela preenchida (3.2:1 sobre branco), igual ao dashboard
          empty: "#CBD5E1",
        },
        cream: "#FEF3C7", // destaque âmbar suave (combina com as estrelas)
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
        card: "0 1px 2px rgba(28, 36, 52, 0.06), 0 1px 1px rgba(28, 36, 52, 0.04)",
        raised: "0 12px 32px -12px rgba(28, 36, 52, 0.22)",
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
