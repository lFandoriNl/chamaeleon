import { Block, Extension, PluginKey } from '@chameleon/core';
import { ConfigureMenuDrawerPlugin } from './configure-menu-drawer-plugin';

declare module '@chameleon/core' {
  interface Commands<ReturnType> {
    configureMenuDrawer: {
      openConfiguration: (target?: Block['id']) => ReturnType;
      closeConfiguration: () => ReturnType;
    };
  }
}

export type ConfigureMenuDrawerOptions = {
  element: HTMLElement | null;
};

const ConfigureMenuDrawerPluginKey = new PluginKey('ConfigureMenuDrawerPlugin');

export const ConfigureMenuDrawer = Extension.create<ConfigureMenuDrawerOptions>(
  {
    name: 'ConfigureMenuDrawer',

    addOptions() {
      return {
        element: null,
      };
    },

    addCommands() {
      return {
        openConfiguration: (target) => {
          return ({ tr }) => {
            tr.select(target).setMeta(ConfigureMenuDrawerPluginKey, {
              open: true,
            });
          };
        },
        closeConfiguration: () => {
          return ({ tr }) => {
            tr.setMeta(ConfigureMenuDrawerPluginKey, { open: false });
          };
        },
      };
    },

    addPlugins() {
      return [
        ConfigureMenuDrawerPlugin({
          pluginKey: ConfigureMenuDrawerPluginKey,
          editor: this.editor,
          element: this.options.element || document.body,
        }),
      ];
    },

    onTransaction({ transaction }) {
      const intention = transaction.getMeta('intention');

      if (intention?.type === 'change-properties') {
        this.editor.commands.openConfiguration(intention.target);
      }
    },
  },
);
