import { Editor } from '@chamaeleon/core';
import { historyName } from '@chamaeleon/plugin-history';

export function connectToReduxDevtools(editor: Editor) {
  // @ts-expect-error
  const reduxDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (reduxDevToolsExtension) {
    const devTools = reduxDevToolsExtension.connect({});

    editor.on('transaction', ({ editor, transaction }) => {
      if (transaction.getMeta(historyName)) {
        return devTools.send(
          `${transaction.getMeta(historyName)}-transaction`,
          editor.state,
        );
      }

      devTools.send('transaction', editor.state);
    });
  }
}
