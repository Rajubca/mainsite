/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './templates/**/*.html',
    './core/templates/**/*.html',
    './blog/templates/**/*.html',
    './**/*.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
