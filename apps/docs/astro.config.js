import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    starlight({
      title: 'Chamaeleon Docs',
      favicon: '/favicon.png',
      social: {
        github: 'https://github.com/lFandoriNl/chamaeleon',
      },
      editLink: {
        baseUrl:
          'https://github.com/lFandoriNl/chamaeleon/tree/master/apps/docs',
      },
      customCss: ['./src/styles/custom.css'],
      expressiveCode: {
        styleOverrides: { borderRadius: '0.5rem' },
      },
      head: [
        {
          tag: 'script',
          attrs: {
            src: '/jumbo.js',
            defer: false,
          },
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            {
              label: 'Setup',
              link: '/getting-started/setup/',
            },
          ],
        },
        {
          label: 'Migrate to Chamaeleon',
          autogenerate: {
            directory: 'migrate-to-chamaeleon',
          },
        },
        {
          label: 'Write plugin guides',
          autogenerate: {
            directory: 'write-plugin-guides',
          },
        },
        {
          label: 'Packages',
          autogenerate: {
            directory: 'packages',
          },
        },
      ],
    }),
  ],
});
