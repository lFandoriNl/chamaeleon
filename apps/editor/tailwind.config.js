/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/uikit/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/renderer/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/component-library-manager/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
