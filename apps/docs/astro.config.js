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
      customCss: ['./src/styles/custom.css'],
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
          label: 'Writing projects with chameleon',
          autogenerate: { directory: 'writing-projects-with-chameleon' },
        },
        {
          label: 'Write plugin guides',
          autogenerate: { directory: 'write-plugin-guides' },
        },
        {
          label: 'Packages',
          autogenerate: { directory: 'packages' },
        },
      ],
    }),
  ],
});
