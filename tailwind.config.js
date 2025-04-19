/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'yellow-primary': '#d6bd9b',
        'yellow-hover': '#c3aa88',
        'yellow-dark': '#b49b7a',
        'black-rich': '#0d273d',
        'black-soft': '#576068',
        'white-pure': '#FFFFFF',
        'white-off': '#F8F8F8',
        'gray-light': '#E5E5E5',
        'gray-medium': '#9E9E9E',
        'deep-navy': '#0d273d',
        'royal-gold': '#d6bd9b',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem' /* 12px */,
        sm: '0.875rem' /* 14px */,
        base: '1rem' /* 16px */,
        lg: '1.125rem' /* 18px */,
        xl: '1.25rem' /* 20px */,
        '2xl': '1.5rem' /* 24px */,
        '3xl': '1.875rem' /* 30px */,
        '4xl': '2.25rem' /* 36px */,
        '5xl': '3rem' /* 48px */,
      },
    },
  },
  plugins: [],
};
