import plugin from 'tailwindcss/plugin';
import sharedConfig from 'tailwind-config/tailwind.config';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [sharedConfig],
  corePlugins: {
    preflight: false,
  },
  plugins: [
    plugin(({ addComponents, theme }) => {
      addComponents({
        '.block-highlight': {
          position: 'relative',
          outline: '2px solid transparent',
          outlineOffset: '2px',
          '--tw-ring-offset-shadow':
            'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
          '--tw-ring-shadow':
            'var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
          boxShadow:
            'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
          '--tw-ring-opacity': '1',
          '--tw-ring-color': 'rgb(37 99 235 / var(--tw-ring-opacity))',
        },
        '.available-drop': {
          position: 'relative',
          zIndex: theme('zIndex.10'),
          outlineStyle: 'solid',
          outlineWidth: '2px',
          outlineColor: theme('colors.lime.200'),
        },
        '.dropzone-over': {
          outlineColor: theme('colors.lime.500'),
        },
      });
    }),
  ],
};
