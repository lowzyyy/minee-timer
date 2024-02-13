/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme.js'
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '450px',
      '3xl': '2000px',
      ...defaultTheme.screens
    },
    extend: {
      fontFamily: { sans: ['Ubuntu', ...defaultTheme.fontFamily.sans] }
    }
  }
}
