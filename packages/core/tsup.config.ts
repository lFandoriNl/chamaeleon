import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/index.ts', 'src/tailwind-plugin.ts'],
  banner: {
    js: `"use client";`,
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: false,
  clean: true,
  minify: true,
  external: ['react', 'react-dom', 'scheduler', 'react/jsx-runtime'],
  injectStyle: true,
  shims: false,
  ...options,
}));
