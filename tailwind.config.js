/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        airtel: {
          red: '#E4002B',
          dark: '#1a1a1a',
        },
      },
      fontFamily: {
        sans: ['Salesforce Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
