/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0A2E52',
        mid: '#0077B6',
        accent: '#00B4D8',
        accent2: '#48CAE4',
        accent3: '#90E0EF',
        lightbg: '#EAF8FB',
        cta: '#F4A261',
        ctadark: '#E76F51',
        textmuted: '#4A6580',
        bordercol: '#D0E8F5',
        sectionbg: '#F5FBFD',
        footerbg: '#071E36',
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};