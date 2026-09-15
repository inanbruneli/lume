/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        level: {
          0: "#f3f4f6",
          1: "#e5e7eb",
          2: "#d1d5db",
          3: "#9ca3af",
          4: "#6b7280",
        }
      }
    }
  }
}