import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    starlight({
      title: 'Chamaeleon Docs',
      favicon: '/favicon.png',
      logo: {
        src: './src/assets/chamaeleon.png',
        replacesTitle: true,
      },
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
