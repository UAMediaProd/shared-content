const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#005a9c',
        'primary-dark': '#004d85',
        'primary-darker': '#102535',

        'primary-dark-lightest': '#eceeef',

        'secondary': '#d40000',
        'secondary-dark': '#aa0000',

        'froly': '#f16669',
        'froly-lightest': '#feecec',

        'sunshade': '#f89621',
        'sunshade-lightest': '#fff8ee',
      }
    },
    fontSize: {
      '2xs': '.5rem',
      'xs': '.75rem',
      'sm': '.875rem',
      'tiny': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    screens: {
      ...defaultTheme.screens,
    }
  },
  plugins: [],
}
