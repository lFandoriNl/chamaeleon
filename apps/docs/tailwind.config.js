import starlightPlugin from '@astrojs/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: {
          200: '#8bd3fa',
          600: '#0075a0',
          900: '#00374e',
          950: '#002839',
        },
        gray: {
          100: '#f6f6f6',
          200: '#eeeeee',
          300: '#c2c2c2',
          400: '#8b8b8b',
          500: '#585858',
          700: '#383838',
          800: '#272727',
          900: '#181818',
        },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [starlightPlugin()],
};