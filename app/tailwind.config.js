module.exports = {
  mode: 'jit',
  purge: ['./src/components/**/*.{ts,tsx,js,jsx}', './src/pages/**/*.{ts,tsx,js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        default: '1rem',
      },
    },
    extend: {
      fontFamily: {
        'base': ['"Poppins"'],
        'heading': ['"Poppins"']
      },
    },
  },
  variants: {},
  plugins: [],
}

/*
main colors:
purple-500
pink-600
indigo-400
*/
