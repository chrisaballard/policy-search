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
        DEFAULT: '#071e4a',
        dark: {
          '100': '#fafbfb',
          '200': '#e6e9ed',
          '300': '#cdd2db',
          '400': '#9ca5b7',
          '500': '#6a7892',
          '600': '#394b6e',
        },
        light: {
          DEFAULT: '#1f93ff',
          '100': '#e9f4ff',
          '200': '#d2e9ff',
          '300': '#a5d4ff',
          '400': '#79beff',
          '500': '#4ca9ff',
        }
      },
      secondary: {
        // PURPLE
        '1': {
          DEFAULT: '#855CF8',
          '100': '#f3effe',
          '200': '#e7defe',
          '300': '#cebefc',
          '400': '#b69dfb',
          '500': '#9d7df9',
        },
        // YELLOW
        '2': {
          DEFAULT: '#F9D074',
          '100': '#fefaf1',
          '200': '#fef6e3',
          '300': '#fdecc7',
          '400': '#fbe3ac',
          '500': '#fad990',
        },
        // GREEN
        '3': {
          DEFAULT: '#3CD1A9',
          '100': '#ecfaf6',
          '200': '#d8f6ee',
          '300': '#b1eddd',
          '400': '#8ae3cb',
          '500': '#63daba',
        },
        // RED
        '4': {
          DEFAULT: '#F86F5C',
          '100': '#fef1ef',
          '200': '#fee2de',
          '300': '#fcc5be',
          '400': '#fba99d',
          '500': '#f98c7d',
        }
      }
    },
    gradientColorStops: {
      'primary-start': '#071e4a',
      'primary-end': '#1F93FF',
      'secondary-start': '#1F93FF',
      'secondary-end': '#FFF'
    },
    container: {
      center: true,
      padding: '1rem'
    },
    extend: {
      outline: {
        primary: ['2px dotted #071e4a', '1px'],
        'primary-light': ['2px dotted #1f93ff', '1px']
      },
      fontFamily: {
        'base': ['"Poppins"'],
        'heading': ['"Poppins"']
      },
      spacing: {
        'full200': '200%'
      },
      animation: {
        fadeInOnce: '0.5s ease-out 0s 1 fadeIn',
        growOnce: '0.3s ease-out 0s 1 grow'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0'},
          '100%': { opacity: '1'}
        },
        grow: {
          '0%': { width: '0'},
          '100%': { width: '100%'}
        }
      }
    },
  },
  variants: {},
  plugins: [],
}
