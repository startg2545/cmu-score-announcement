/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "sm": "490px", // Use a colon (:) instead of a semicolon (;)
      },
      colors: {
        // Define your custom colors here
        primary: "#8084C8",
        secondary: "#777ABA",
        maintext: "#696CA3",
      },
    },
  },
};
