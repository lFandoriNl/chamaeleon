import starlightPlugin from '@astrojs/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./public/**/*.js', './src/**/*.{astro,html,js,md,mdx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          200: '#82dccc',
          600: '#007d6f',
          900: '#003c34',
          950: '#002b25',
        },
        gray: {
          100: '#f5f6f8',
          200: '#ebeef2',
          300: '#bec2c7',
          400: '#858d94',
          500: '#525960',
          700: '#323940',
          800: '#21282e',
          900: '#16191b',
        },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [starlightPlugin()],
};
