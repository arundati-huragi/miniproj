module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#24ab8f",
        "primary-dark": "#268d77",
        "secondary": "#fbbf24",
        "accent": "#3b82f6",
        "background": "#f9fafb",
        "card-bg": "#ffffff",
        "text-primary": "#1f2937",
        "text-secondary": "#4b5563",
      },
      fontFamily: {
        sans: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      animation: {
        "loader": "loader 1s linear infinite",
      },
      keyframes: {
        loader: {
          "0%": { transform: "rotate(0) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.5)" },
          "100%": { transform: "rotate(360deg) scale(1)" }
        }
      }
    },
  },
  plugins: [],
}
