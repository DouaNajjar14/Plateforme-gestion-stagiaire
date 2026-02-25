/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        ooredoo: {
          DEFAULT: '#D90012',
          50:  '#FFF1F1',
          100: '#FFE0E0',
          200: '#FFC5C5',
          300: '#FF9B9B',
          400: '#FF5E5E',
          500: '#FF1F2D',
          600: '#D90012',
          700: '#C1000F',
          800: '#A8000D',
          900: '#7A0008',
          950: '#450004',
        },
        brand: {
          text:   '#0E0C0C',
          muted:  '#7A736C',
          light:  '#B8B0A8',
          bg:     '#F5F3F0',
          card:   '#FFFFFF',
          border: '#E8E4E0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(14, 12, 12, 0.04)',
        'card-hover': '0 8px 24px rgba(217, 0, 18, 0.08)',
        'modal': '0 24px 64px rgba(14, 12, 12, 0.18)',
        'toast': '0 8px 24px rgba(14, 12, 12, 0.18)',
        'btn-red': '0 4px 16px rgba(217, 0, 18, 0.25)',
        'btn-red-hover': '0 8px 28px rgba(217, 0, 18, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out',
        'modal-in': 'modalIn 0.25s ease-out',
        'overlay-in': 'overlayIn 0.2s ease-out',
        'toast-in': 'toastIn 0.3s ease-out',
        'spin-slow': 'spin 0.8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        modalIn: {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        overlayIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        toastIn: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

