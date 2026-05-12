/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundColor: {
        primary: "#00478A",
        secondary: "#F1F979",
      },
      colors: {
        white: "#FFFFFF",
        offWhite: "#FAFFF2",
        darkBlue: "#001959",
        midBlue: "#00478A",
        lightBlue: "#4187E1",
        yellow: "#F1F979",
        lightYellow: "#EAFFC8",
      },
    },
  },
  plugins: [],
};