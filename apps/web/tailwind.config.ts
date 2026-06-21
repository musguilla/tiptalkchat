import type { Config } from 'tailwindcss';

/**
 * Vivid Pulse Light — design system tokens.
 * See /Users/luis/Downloads/DESIGN.md (the brief that drove this config).
 *
 * - Primary  #FF5C00 (vibrant orange) — main CTAs, active states, brand-heavy
 * - Secondary #FF007A (powerful pink) — accents, notifications, gradients
 * - Canvas   #FAF8FF (background)
 * - Surface  #FFFFFF (cards) / #F2F3FF (alt sections) / #EAEDFF (containers)
 * - Ink      #131B2E (text) / #5B4137 (muted) / #8F7065 (faint)
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Headlines — Plus Jakarta Sans (loaded in layout.tsx via next/font)
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        // Body — Inter
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        // Metadata, chips, labels — JetBrains Mono
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        canvas: '#FAF8FF',
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#F2F3FF',
          container: '#EAEDFF',
          high: '#E2E7FF',
        },
        ink: {
          DEFAULT: '#131B2E',
          muted: '#5B4137',
          soft: '#8F7065',
          inverse: '#EEF0FF',
        },
        primary: {
          50: '#FFF5EF',
          100: '#FFDBCE',
          200: '#FFB59A',
          300: '#FF8C5F',
          400: '#FF7330',
          500: '#FF5C00',
          600: '#E54F00',
          700: '#A73A00',
          800: '#802A00',
          900: '#521800',
          950: '#370E00',
        },
        secondary: {
          50: '#FFF1F7',
          100: '#FFD9E0',
          200: '#FFB1C3',
          300: '#FF89A4',
          400: '#FF4082',
          500: '#FF007A',
          600: '#E4006C',
          700: '#B60055',
          800: '#8F0041',
          900: '#5C002A',
          950: '#3F0019',
        },
        // Backward compat: pages that still say `bg-brand-600` resolve to the
        // new orange palette instead of the old magenta.
        brand: {
          50: '#FFF5EF',
          500: '#FF5C00',
          600: '#E54F00',
          700: '#A73A00',
        },
        tipsy: { gold: '#FACC15' },
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.04)',
        card: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)',
        vivid: '0 8px 32px rgba(255, 92, 0, 0.08)',
        'vivid-strong': '0 12px 40px rgba(255, 92, 0, 0.16)',
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      maxWidth: {
        '7xl': '1280px',
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
