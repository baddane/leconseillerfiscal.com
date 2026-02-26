/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0f0e0b',
        paper: '#f5f0e8',
        gold: '#c9a84c',
        'gold-light': '#e8d49a',
        border: '#d4c9b0',
        grey: '#6b6560',
        red: '#8b1a1a',
        cream: '#fdf8f0',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.ink'),
            a: { color: theme('colors.gold'), textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
            h2: { color: theme('colors.ink'), fontFamily: theme('fontFamily.serif').join(', ') },
            h3: { color: theme('colors.ink'), fontFamily: theme('fontFamily.serif').join(', ') },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
