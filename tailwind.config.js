/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
  "./App.tsx",
  "./app/**/*.{js,jsx,ts,tsx}",     // This is what you were missing!
  "./components/**/*.{js,jsx,ts,tsx}"
],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        gradientStart: '#000814',
        gradientEnd: '#00000A',
        primary: {
          DEFAULT: '#003566',
          100: '#336699',
          200: '#285080',
          300: '#1F3B66',
          400: '#14264D',
          500: '#0A1233',
          600: '#00001A'
        },
        darkGold: {
          DEFAULT: "#FFC300",
          100: "#FFD633",
          200: "#FFCC00",
          300: "#E6B800",
          400: "#CC9900",
          500: "#B38A00",
          600: "#996B00"
        },
        lightGold: {
          DEFAULT: "#FFD60A",
          100: "#FFDD33",
          200: "#FFD700",
          300: "#E6C200",
          400: "#CCAA00",
          500: "#B38A00",
          600: "#996B00"
        },
        secondary: {
          DEFAULT: "#001D3D",
          100: "#334D66",
          200: "#2A3F55",
          300: "#213244",
          400: "#182533",
          500: "#0F1822",
          600: "#060B11"
        },
        backGround: { // Fixed the naming from backGround
          DEFAULT: "#000814",
          100: "#333344",
          200: "#29292B",
          300: "#1F1F22",
          400: "#151518",
          500: "#0B0B0E",
          600: "#00000A"
        }
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      }
    },
  },
  plugins: [],
}