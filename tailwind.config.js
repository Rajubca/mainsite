/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        journal: ['Crimson Pro', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        parchment: '#0f172a',
        sepia: '#3b82f6',
        forest: '#eab308',
        ink: '#f8fafc',
        muted: '#1e293b',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
