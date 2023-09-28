import { Block, Extension, PluginKey } from '@chameleon/core';
import { ConfigureDrawerPlugin } from './configure-drawer-plugin';

declare module '@chameleon/core' {
  interface Commands<ReturnType> {
    configureDrawer: {
      openConfiguration: (target?: Block['id']) => ReturnType;
      closeConfiguration: () => ReturnType;
    };
  }
}

export type ConfigureDrawerOptions = {
  element: HTMLElement | null;
};

const ConfigureDrawerPluginKey = new PluginKey('ConfigureDrawerPlugin');

export const ConfigureDrawer = Extension.create<ConfigureDrawerOptions>({
  name: 'ConfigureDrawer',

  addOptions() {
    return {
      element: null,
    };
  },

  addCommands() {
    return {
      openConfiguration: (target) => {
        return ({ tr }) => {
          tr.select(target).setMeta(ConfigureDrawerPluginKey, {
            open: true,
          });
        };
      },
      closeConfiguration: () => {
        return ({ tr }) => {
          tr.setMeta(ConfigureDrawerPluginKey, { open: false });
        };
      },
    };
  },

  addPlugins({ editor, options }) {
    return [
      ConfigureDrawerPlugin({
        pluginKey: ConfigureDrawerPluginKey,
        editor,
        element: options.element || document.body,
      }),
    ];
  },

  onTransaction({ editor }, { transaction }) {
    const intention = transaction.getMeta('intention');

    if (intention?.type === 'change-properties') {
      Promise.resolve().then(() =>
        editor.commands.openConfiguration(intention.target),
      );
    }
  },
});
