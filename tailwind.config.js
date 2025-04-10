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
        primary: '#3b82f6',
      },
      animation: {
        ripple: 'ripple 0.8s linear forwards',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },
      scale: {
        98: '0.98',
      },
    },
  },
  plugins: [],
};
