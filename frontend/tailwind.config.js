/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Define your custom colors here
        primary: "#8084C8",
        secondary: "#777ABA",
        maintext: "#696CA3",
      },
    },
  },
};
