import sharedConfig from 'tailwind-config/tailwind.config';
import { tailwindPlugin } from '@chamaeleon/core/dist/tailwind-plugin';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [sharedConfig],
  plugins: [tailwindPlugin()],
};
