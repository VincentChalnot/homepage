/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.md',
    './assets/**/*.scss',
  ],
  theme: {
    extend: {
      colors: {
        pcb: {
          bg: '#030c05',
          surface: '#071a0d',
          trace: '#233e2a',
          highlight: '#0a2410',
        },
        neon: {
          DEFAULT: '#00ff88',
          dim: '#1a8a4a',
          glow: '#00cc66',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'pcb': "url('/media/pcb-pattern.svg')",
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { textShadow: '0 0 4px rgba(0,255,136,0.3)' },
          '100%': { textShadow: '0 0 12px rgba(0,255,136,0.6)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
