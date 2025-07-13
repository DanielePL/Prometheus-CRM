/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#1a1a1a',
          800: '#222',
          700: '#333',
          600: '#444',
          500: '#666',
          400: '#888',
          300: '#aaa',
          200: '#ccc',
          100: '#eee'
        },
        orange: {
          500: '#ff6600',
          600: '#e55a00'
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif']
      }
    },
  },
  plugins: [],
}
