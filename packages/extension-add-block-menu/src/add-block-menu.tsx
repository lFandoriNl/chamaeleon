import { Block, Extension, PluginKey } from '@chameleon/core';
import { AddBlockMenuPlugin } from './add-block-menu-plugin';

declare module '@chameleon/core' {
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
  name: 'ConfigureMenuDrawer',

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

  addPlugins() {
    return [
      AddBlockMenuPlugin({
        pluginKey: AddBlockMenuPluginKey,
        editor: this.editor,
        element: this.options.element || document.body,
      }),
    ];
  },

  onTransaction({ transaction }) {
    const intention = transaction.getMeta('intention');

    if (intention?.type === 'add-block') {
      this.editor.commands.openAddBlockMenu(intention.target, intention.event);
    }
  },
});
