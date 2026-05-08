/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,tsx,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4', // Core Cyan
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        brand: {
          violet: '#8b5cf6',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        },
        dark: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        }
      },
      fontFamily: {
        display: ['Outfit', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        dyslexic: ['OpenDyslexic', 'sans-serif'],
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'orbit': 'orbit 20s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(150px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(150px) rotate(-360deg)' },
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'hero-mesh': 'radial-gradient(at 0% 0%, hsla(185, 100%, 50%, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(260, 100%, 50%, 0.15) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-blue': '0 0 0 2px rgba(6, 182, 212, 0.5)',
        'glow-violet': '0 0 0 2px rgba(139, 92, 246, 0.5)',
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
