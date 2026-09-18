/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: '#FAF9F6',
        'surface-bright': '#FAF9F6',
        'surface-dim': '#DBD0D7',
        'surface-container-low': '#F4F2EB',
        'surface-container': '#EFEEEB',
        'surface-container-high': '#E9E8E5',
        'surface-container-highest': '#E3E2E0',
        'surface-container-lowest': '#FFFFFF',
        'on-surface': '#111215',
        'on-surface-variant': '#5E6068',
        borderline: 'rgba(17, 18, 21, 0.12)',
        'borderline-strong': 'rgba(17, 18, 21, 0.22)',
        ivory: {
          DEFAULT: '#FAF9F6',
          50: '#FFFFFF',
          100: '#FAF9F6',
          200: '#F4F2EB',
          300: '#D9D5C9',
          400: '#C7C2B4',
        },
        graphite: {
          DEFAULT: '#111215',
          900: '#111215',
          800: '#1C1D21',
          700: '#2A2C32',
          500: '#5E6068',
          400: '#7E818B',
          300: '#A4A7B2',
          200: '#D5D7DC',
        },
        cobalt: {
          DEFAULT: '#1B365D',
          900: '#0B1D3A',
          800: '#102A54',
          700: '#1B365D',
          600: '#224679',
          500: '#2E5B9A',
          100: '#EAF0F9',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.125rem', // 2px
        sm: '0.125rem',
        md: '0.25rem', // 4px
        lg: '0.375rem',
        xl: '0.5rem',
        full: '9999px',
      },
      letterSpacing: {
        'tighter-editorial': '-0.045em',
        'tight-editorial': '-0.035em',
        'wide-caps': '0.08em',
      },
    },
  },
  plugins: [],
}
