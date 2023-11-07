import { Extension } from '../extension';
import { contentPlugin } from '../plugins/content-plugin';

export const BaseProps = Extension.create({
  name: 'base-props',

  addPlugins() {
    return [contentPlugin];
  },
});
