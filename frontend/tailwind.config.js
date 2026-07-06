/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          coral: '#FF6B6B',
          soft: '#FFA8A8',
        },
        wero: {
          lime: '#DFFE00',
          dark: {
            800: '#170c40',
            900: '#0A0224',
            950: '#030014',
          }
        },
        glow: {
          cyan: '#06b6d4',
          indigo: '#6366f1',
          coral: '#f43f5e',
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.06)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'glow-cyan': '0 0 20px 2px rgba(6, 182, 212, 0.15)',
        'glow-indigo': '0 0 20px 2px rgba(99, 102, 241, 0.15)',
        'wero-glow': '0 0 20px 2px rgba(223, 254, 0, 0.15)',
        'wero-glow-strong': '0 0 30px 4px rgba(223, 254, 0, 0.25)',
      },
      animation: {
        'aurora-slow': 'aurora 25s ease-in-out infinite',
        'aurora-medium': 'aurora 18s ease-in-out infinite',
        'aurora-fast': 'aurora 12s ease-in-out infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1) rotate(0deg)' },
          '33%': { transform: 'translate(50px, -60px) scale(1.2) rotate(120deg)' },
          '66%': { transform: 'translate(-40px, 30px) scale(0.8) rotate(240deg)' },
        }
      }
    },
  },
  plugins: [],
}
