import { Block, Plugin } from '@chamaeleon/core';
import ReactDOM from 'react-dom';

import { ConfigurationDrawerView } from './configuration-drawer-view';

declare module '@chamaeleon/core' {
  interface Commands<ReturnType> {
    configurationDrawer: {
      openConfiguration: (target?: Block['id']) => ReturnType;
      closeConfiguration: () => ReturnType;
    };
  }
}

export type ConfigurationDrawerState = {
  element: HTMLElement;
  open: boolean;
};

export type ConfigurationDrawerOptions = {
  element?: HTMLElement;
};

export const configurationDrawerName = 'configuration-drawer';

export function ConfigurationDrawer(
  options: ConfigurationDrawerOptions = {},
): Plugin<ConfigurationDrawerState> {
  return {
    name: configurationDrawerName,
    apply(editor, { addCommands, addView, getState }) {
      editor.on('transaction', ({ transaction }) => {
        const intention = transaction.getMeta('intention');

        if (intention?.type === 'change-properties') {
          Promise.resolve().then(() =>
            editor.commands.openConfiguration(intention.target),
          );
        }
      });

      addCommands({
        openConfiguration: (target) => {
          return ({ tr }) => {
            tr.select(target).setMeta(configurationDrawerName, {
              open: true,
            });
          };
        },
        closeConfiguration: () => {
          return ({ tr }) => {
            tr.setMeta(configurationDrawerName, { open: false });
          };
        },
      });

      addView({
        name: editor.pluginViewTokens.configuration,
        component: () => {
          const { element, open } = getState();

          return ReactDOM.createPortal(
            <ConfigurationDrawerView open={open} editor={editor} />,
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
        if (!tr.getMeta(configurationDrawerName)) {
          return value;
        }

        return {
          element: value.element,
          open: tr.getMeta(configurationDrawerName)?.open === true,
        };
      },
    },
  };
}
