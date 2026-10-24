/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0B0F14',
          surface: '#121821',
          elevated: '#1A2230',
        },
        critical: {
          DEFAULT: '#EF4444',
          dark: '#B91C1C',
          light: '#FCA5A5',
        },
        high: {
          DEFAULT: '#F97316',
          dark: '#C2410C',
          light: '#FDBA74',
        },
        safe: {
          DEFAULT: '#22C55E',
          dark: '#15803D',
          light: '#86EFAC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'pulse-ring': {
          '0%':   { transform: 'scale(0.95)', opacity: '0.7' },
          '70%':  { transform: 'scale(1.6)',  opacity: '0' },
          '100%': { transform: 'scale(1.6)',  opacity: '0' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
  plugins: [],
}