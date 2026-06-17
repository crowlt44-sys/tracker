/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF7',
          100: '#F9F6EE',
          200: '#F3EFE0',
          300: '#EDE6D2',
          400: '#E0D6BE',
        },
        kuning: {
          pastel: '#FFD254',
          100: '#FFF3CC',
          200: '#FFE68A',
          300: '#FFD254',
        },
        dark: {
          soft: '#2D2D2D',
          base: '#1E1E1E',
          card: '#2A2A2A',
          light: '#3A3A3A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
