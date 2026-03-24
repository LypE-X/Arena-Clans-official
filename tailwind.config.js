/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eaffea',
          100: '#c2ffc2',
          400: '#4dff4d',
          500: '#21ff21',
          600: '#16cc16',
          700: '#12a312',
          900: '#0a5c0a',
          950: '#000000',
        },
        dark: {
          800: '#262626',
          900: '#171717',
          950: '#000000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // ✨ ADICIONADO: Animação do Raio/Meteoro
      keyframes: {
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-1000px)",
            opacity: "0",
          },
        },
      },
      animation: {
        "meteor-effect": "meteor 5s linear infinite",
      },
    },
  },
  plugins: [],
}