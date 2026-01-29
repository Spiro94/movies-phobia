/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        danger: {
          green: '#4caf50',
          yellow: '#ff9800',
          red: '#f44336',
        },
        app: {
          bg: '#0a0a0a',
          card: '#1a1a1a',
          border: '#333',
        }
      },
    },
  },
  plugins: [],
}
