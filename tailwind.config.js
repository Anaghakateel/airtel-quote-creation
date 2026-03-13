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
        // App grey: #F5F5F5 (match screenshot 1)
        'grey-bg': '#F5F5F5',
        grey: '#F5F5F5',
      },
      fontFamily: {
        sans: ['Salesforce Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
