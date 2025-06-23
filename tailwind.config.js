import { with21st } from '@21stdev/tailwind';

/** @type {import('tailwindcss').Config} */
export default with21st({
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'fade-slide-up': 'fadeSlideUp 0.6s ease-out both',
      },
      keyframes: {
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
});
