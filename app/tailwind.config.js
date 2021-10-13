const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./src/components/**/*.{ts,tsx,js,jsx}', './src/pages/**/*.{ts,tsx,js,jsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      red: colors.rose,
      primary: {
        dark: '#071e4a',
        DEFAULT: '#2077e3',
        light: '#09b9f9'
      }
    },
    container: {
      center: true,
      padding: '1rem'
    },
    extend: {
      fontFamily: {
        'base': ['"Poppins"'],
        'heading': ['"Poppins"']
      },
      spacing: {
        'full200': '200%'
      }
    },
  },
  variants: {},
  plugins: [],
}
