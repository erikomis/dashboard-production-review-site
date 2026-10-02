/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

/** Cor definida por variável CSS (canais RGB), para os temas claro e escuro e com suporte a /opacidade. */
const themed = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  // A classe "dark" no <html> é aplicada antes da pintura por um script inline no index.html
  darkMode: "class",
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
        // Paleta compartilhada com o dashboard (primary #3C50E0). Os tokens neutros e os tons de
        // texto da marca mudam com o tema (valores em src/index.css); todos os pares texto/fundo
        // usados no site atingem contraste AA (>= 4.5:1) nos dois temas.
        ink: {
          DEFAULT: themed("ink"), // texto principal
          soft: themed("ink-soft"), // texto secundário forte
        },
        muted: themed("muted"), // texto auxiliar
        canvas: themed("canvas"), // fundo da página
        surface: themed("surface"), // cards, menus e campos
        line: {
          DEFAULT: themed("line"),
          strong: themed("line-strong"), // bordas de campos (>= 3:1)
        },
        // Fundo suave da marca (chips, avatares, destaques)
        tint: {
          DEFAULT: themed("brand-50"),
          strong: themed("tint-strong"),
        },
        brand: {
          50: themed("brand-50"),
          100: "#DFE4FD", // texto sobre o índigo escuro (hero, rodapé)
          200: "#C3CBFB",
          300: "#98A5F6",
          500: "#4F63EA",
          600: "#3C50E0", // botões (6.2:1 com branco), igual nos dois temas
          700: themed("brand-700"), // links e destaques de texto
          800: themed("brand-800"),
          900: themed("brand-900"),
          950: "#141B45",
        },
        primary: {
          DEFAULT: "#3C50E0",
          hover: "#3040B8",
          active: "#283590",
        },
        star: {
          DEFAULT: "#D97706", // estrela preenchida, igual ao dashboard
          empty: themed("star-empty"),
        },
        cream: themed("cream"), // destaque âmbar suave (combina com as estrelas)
        danger: {
          DEFAULT: themed("danger"),
          soft: themed("danger-soft"),
          solid: "#B42318", // fundo de botão destrutivo (6.2:1 com branco)
        },
        success: {
          DEFAULT: themed("success"),
          soft: themed("success-soft"),
        },
      },
      boxShadow: {
        card: "0 1px 2px rgb(var(--c-shadow) / 0.06), 0 1px 1px rgb(var(--c-shadow) / 0.04)",
        raised: "0 12px 32px -12px rgb(var(--c-shadow) / 0.22)",
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "bell-ring": {
          "0%, 100%": { transform: "rotate(0)" },
          "20%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-10deg)" },
          "60%": { transform: "rotate(6deg)" },
          "80%": { transform: "rotate(-3deg)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s ease-in-out infinite",
        "fade-in": "fade-in 180ms ease-out both",
        "pop-in": "pop-in 160ms ease-out both",
        "bell-ring": "bell-ring 700ms ease-in-out 1",
      },
    },
  },
  plugins: [],
};
