import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/renderer/**/*.{ts,tsx}',
    '../../packages/design-system/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        prism: {
          violet: '#7c6fff',
          'violet-light': '#a78bfa',
          dark: '#07070f',
        },
      },
      borderRadius: {
        glass: '20px',
        'glass-sm': '12px',
        'glass-lg': '28px',
      },
      backdropBlur: {
        glass: '40px',
        'glass-sm': '20px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
        'glass-hover': '0 12px 40px rgba(124,111,255,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
