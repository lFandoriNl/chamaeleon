import ReactDOM from 'react-dom';

import { Block, Plugin } from '@chamaeleon/core';

import { Menu } from './menu';

declare module '@chamaeleon/core' {
  interface Commands<ReturnType> {
    addBlockMenu: {
      openAddBlockMenu: (
        target: Block['id'],
        element: HTMLElement,
      ) => ReturnType;
      closeAddBlockMenu: () => ReturnType;
    };
  }
}

export type AddBlockMenuState =
  | {
      element: HTMLElement;
      open: true;
      target: Block['id'];
      anchorEl: HTMLElement;
    }
  | {
      element: HTMLElement;
      open: false;
    };

export type AddBlockMenuOptions = {
  element?: HTMLElement;
};

export const addBlockMenuName = 'add-block-menu';

export function AddBlockMenu(
  options: AddBlockMenuOptions = {},
): Plugin<AddBlockMenuState> {
  return {
    name: addBlockMenuName,

    apply(editor, { addCommands, addView, getState }) {
      editor.on('transaction', ({ transaction }) => {
        const intention = transaction.getMeta('intention');

        if (intention?.type === 'add-block') {
          Promise.resolve().then(() =>
            editor.commands.openAddBlockMenu(
              intention.target,
              intention.element,
            ),
          );
        }
      });

      addCommands({
        openAddBlockMenu: (target, element) => {
          return ({ tr }) => {
            tr.select(target).setMeta(addBlockMenuName, {
              open: true,
              target,
              element,
            });
          };
        },
        closeAddBlockMenu: () => {
          return ({ tr }) => {
            tr.setMeta(addBlockMenuName, { open: false });
          };
        },
      });

      addView({
        name: editor.pluginViewTokens.addBlockInline,
        component: () => {
          const { state } = editor;

          const pluginState = getState();

          if (!pluginState.open) return null;

          const { target, anchorEl, element } = pluginState;

          const allowedBlocksItems = state.schema
            .getAllowContent(state.getBlock(target))
            .map((blockType) => {
              const Component = editor.view.getBlockViews(blockType.name)[
                'palette'
              ];

              return {
                id: blockType.name,
                name: blockType.name,
                component: <Component />,
              };
            });

          return ReactDOM.createPortal(
            <Menu
              anchorEl={anchorEl}
              items={allowedBlocksItems}
              onClick={({ name }) => {
                editor.commands.insertContent(target, {
                  type: name,
                });
              }}
              onClose={() => editor.commands.closeAddBlockMenu()}
            />,
            element,
          );
        },
      });
    },

    state: {
      init() {
        return {
          element: options.element || document.body,
          open: false,
        };
      },
      apply(tr, value) {
        const meta = tr.getMeta(addBlockMenuName);

        if (!meta) {
          return value;
        }

        if (meta.open) {
          return {
            element: value.element,
            open: true,
            target: meta.target,
            anchorEl: meta.element,
          };
        }

        return {
          element: value.element,
          open: false,
        };
      },
    },
  };
}
