import sharedConfig from 'tailwind-config/tailwind.config';

import { tailwindPlugin } from './src/tailwind-plugin';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [sharedConfig],
  theme: {
    extend: {},
  },
  plugins: [tailwindPlugin()],
};
