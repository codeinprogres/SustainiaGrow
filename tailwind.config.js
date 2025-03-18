/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",                   // Main HTML file in root
    "./server/templates/**/*.html",    // HTML templates in Flask's templates folder
    "./server/static/js/**/*.js",      // JavaScript files in the static folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}