/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        black:     "#333333",  // 編輯
        secondary: "#9F9A91",  // 編輯
        yellow:    "#FFD370",  // 編輯
        pink:      "#D87355",  // 編輯
      },
    },
  },
  plugins: [],
}

