module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,          // 自动水平居中
      padding: {
        DEFAULT: '1rem',     // 默认左右 1rem
        sm:      '2rem',     // sm 断点以上 2rem
        lg:      '4rem',     // lg 以上 4rem
        xl:      '5rem',
        '2xl':   '6rem',
      },
    },
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
