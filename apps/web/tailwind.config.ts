import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2ff',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
        },
        tipsy: {
          gold: '#facc15',
        },
      },
      keyframes: {
        tipfly: {
          '0%': { transform: 'translateY(20px) scale(0.6)', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { transform: 'translateY(-80px) scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        tipfly: 'tipfly 1.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
