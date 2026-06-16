/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2d6a4f',
        accent: '#52b788',
        background: '#f0faf4',
      },
    },
  },
  plugins: [],
}
