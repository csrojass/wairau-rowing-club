/** @type {import('tailwindcss').Config} */
// Wairau Rowing Club — pure green/black/white palette.
// Class names kept as `navy / ocean / teal / coral` for stability — they now
// resolve to the club colours below.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Dark — very dark forest, near-black (header, footer, hero overlay)
        navy: {
          DEFAULT: '#0A1F14',
          900: '#050E09',
          800: '#0A1F14',
          700: '#103221',
        },
        // Brand green (primary)
        ocean: {
          DEFAULT: '#0E6B3F',
          600: '#0A4D2C',
          500: '#138A4F',
        },
        // Bright green accent (eyebrow text on dark bg, badges, hover states)
        teal: {
          DEFAULT: '#2EA85F',
          500: '#2EA85F',
          400: '#3DB870',
          300: '#5CCC8C',
        },
        // CTA green — same family as ocean, slightly brighter for buttons
        coral: {
          DEFAULT: '#0E6B3F',
          600: '#0A4D2C',
          500: '#0E6B3F',
          400: '#138A4F',
        },
        cream: '#F5F8F3',
        sand: '#F0F4ED',
      },
      fontFamily: {
        sans: ['Amaranth', 'system-ui', 'sans-serif'],
        display: ['"Hammersmith One"', 'Amaranth', 'system-ui', 'sans-serif'],
        script: ['"Playwrite DE Grund"', 'cursive'],
      },
      backgroundImage: {
        'water-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='20' viewBox='0 0 100 20'%3E%3Cpath d='M0 10 Q 25 0 50 10 T 100 10' fill='none' stroke='%23ffffff' stroke-opacity='0.10' stroke-width='1.5'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
