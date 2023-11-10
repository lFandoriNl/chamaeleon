import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/index.ts'],
  banner: {
    js: `"use client";`,
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: false,
  clean: true,
  minify: true,
  external: [],
  injectStyle: true,
  shims: false,
  ...options,
}));
