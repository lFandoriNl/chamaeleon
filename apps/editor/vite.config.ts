import path from 'node:path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// function resolveWorkspaceAlias(workspace: string) {
//   return {
//     [`@chameleon/${workspace}`]: path.resolve(
//       '..',
//       '..',
//       'packages',
//       workspace,
//       'src',
//     ),
//     [`@chameleon/${workspace}/*`]: path.resolve(
//       '..',
//       '..',
//       'packages',
//       workspace,
//       'src',
//       '*',
//     ),
//   };
// }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // resolve: {
  //   alias: {
  //     ...resolveWorkspaceAlias('plugin'),
  //     ...resolveWorkspaceAlias('uikit'),
  //     ...resolveWorkspaceAlias('component-library-manager'),
  //   },
  // },
});
