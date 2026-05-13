/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0F3A7D',
        'brand-orange': '#FF6B35',
      },
    },
  },
  plugins: [],
}
