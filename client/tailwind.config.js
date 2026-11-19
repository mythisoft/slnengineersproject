/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            950: '#050e1a',
            900: '#0a1b2e',
            800: '#0f2c4d',
          },
          blue: {
            700: '#0f4c81',
            600: '#0284c7',
            500: '#0ea5e9',
            400: '#38bdf8',
            100: '#e0f2fe',
            50: '#f0f9ff',
          },
          green: {
            800: '#064e3b',
            700: '#047857',
            600: '#059669',
            500: '#10b981',
            400: '#34d399',
            100: '#d1fae5',
            50: '#ecfdf5',
          },
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['"Space Grotesk"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -3px rgba(2, 132, 199, 0.4)',
        'glow-green': '0 0 25px -3px rgba(16, 185, 129, 0.4)',
      },
    },
  },
  plugins: [],
}
