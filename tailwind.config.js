/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-navy': '#152354',
        'royal-gold': '#D4AF37',
        'deep-gold': '#B8860B',
        gold: '#FFD700',
      },
    },
  },
  plugins: [],
};
