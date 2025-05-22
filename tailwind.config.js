module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B8E23',
          light:   '#8CAA4C', // Optional：根据需要自己调亮度
          dark:    '#4D6B1A'
        }
      }
    }
  },
  plugins: [],
};
