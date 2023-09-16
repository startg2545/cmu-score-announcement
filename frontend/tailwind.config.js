/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Define your custom colors here
        primary: "#8084c8",
        secondary: "#777ABA",
        maintext: "#696ca3",
      },
    },
  },
  plugins: [],
};
