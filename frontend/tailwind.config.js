export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#021024",
        primary: "#052659",
        surface: "#0a3070",
        accent: "#5483B3",
        soft: "#7DA0CA",
        highlight: "#C1E8FF",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl:  "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(84,131,179,0.25)",
        card: "0 4px 24px rgba(2,16,36,0.6)",
      },
    },
  },
  plugins: [],
};
