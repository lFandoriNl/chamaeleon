import { Block, Extension, PluginKey } from '@chamaeleon/core';
import { AddBlockMenuPlugin } from './add-block-menu-plugin';

declare module '@chamaeleon/core' {
  interface Commands<ReturnType> {
    addBlockMenu: {
      openAddBlockMenu: (target: Block['id'], event: Event) => ReturnType;
      closeAddBlockMenu: () => ReturnType;
    };
  }
}

export type AddBlockMenuOptions = {
  element: HTMLElement | null;
};

const AddBlockMenuPluginKey = new PluginKey('AddBlockMenuPlugin');

export const AddBlockMenu = Extension.create<AddBlockMenuOptions>({
  name: 'ConfigurationMenuDrawer',

  addOptions() {
    return {
      element: null,
    };
  },

  addCommands() {
    return {
      openAddBlockMenu: (target, event) => {
        return ({ tr }) => {
          tr.select(target).setMeta(AddBlockMenuPluginKey, {
            open: true,
            target,
            event,
          });
        };
      },
      closeAddBlockMenu: () => {
        return ({ tr }) => {
          tr.setMeta(AddBlockMenuPluginKey, { open: false });
        };
      },
    };
  },

  addPlugins({ editor, options }) {
    return [
      AddBlockMenuPlugin({
        pluginKey: AddBlockMenuPluginKey,
        editor,
        element: options.element || document.body,
      }),
    ];
  },

  onTransaction({ editor }, { transaction }) {
    const intention = transaction.getMeta('intention');

    if (intention?.type === 'add-block') {
      Promise.resolve().then(() =>
        editor.commands.openAddBlockMenu(intention.target, intention.event),
      );
    }
  },
});
