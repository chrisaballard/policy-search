module.exports = {
  mode: 'jit',
  purge: ['./src/components/**/*.{ts,tsx,js,jsx}', './src/pages/**/*.{ts,tsx,js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem'
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
