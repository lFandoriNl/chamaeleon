import { Block, Extension, PluginKey } from '@chamaeleon/core';
import { ConfigurationDrawerPlugin } from './configuration-drawer-plugin';

declare module '@chamaeleon/core' {
  interface Commands<ReturnType> {
    configurationDrawer: {
      openConfiguration: (target?: Block['id']) => ReturnType;
      closeConfiguration: () => ReturnType;
    };
  }
}

export type ConfigurationDrawerOptions = {
  element: HTMLElement | null;
};

const ConfigurationDrawerPluginKey = new PluginKey('ConfigurationDrawerPlugin');

export const ConfigurationDrawer = Extension.create<ConfigurationDrawerOptions>(
  {
    name: 'ConfigurationDrawer',

    addOptions() {
      return {
        element: null,
      };
    },

    addCommands() {
      return {
        openConfiguration: (target) => {
          return ({ tr }) => {
            tr.select(target).setMeta(ConfigurationDrawerPluginKey, {
              open: true,
            });
          };
        },
        closeConfiguration: () => {
          return ({ tr }) => {
            tr.setMeta(ConfigurationDrawerPluginKey, { open: false });
          };
        },
      };
    },

    addPlugins({ editor, options }) {
      return [
        ConfigurationDrawerPlugin({
          pluginKey: ConfigurationDrawerPluginKey,
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
  },
);
