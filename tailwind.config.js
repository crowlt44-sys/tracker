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
          50: '#FFFFFF',
          100: '#F8F9FA',
          200: '#F1F3F5',
          300: '#E9ECEF',
          400: '#DEE2E6',
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
