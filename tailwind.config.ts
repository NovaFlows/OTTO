import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'otto-black':    'rgb(var(--c-bg)    / <alpha-value>)',
        'otto-charcoal': 'rgb(var(--c-bg2)   / <alpha-value>)',
        'otto-chalk':    'rgb(var(--c-chalk) / <alpha-value>)',
        'otto-white':    'rgb(var(--c-white) / <alpha-value>)',
        'otto-grey':     'rgb(var(--c-grey)  / <alpha-value>)',
        'otto-paper':    '#ECEAE4',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono:  ['var(--font-space-mono)', 'monospace'],
      },
      letterSpacing: {
        'widest-2': '0.2em',
        'widest-3': '0.3em',
      },
    },
  },
  plugins: [],
}

export default config
