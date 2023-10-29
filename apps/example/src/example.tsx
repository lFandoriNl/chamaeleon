import { useEffect } from 'react';

import { Editor } from '@chamaeleon/core';
import { Persist } from '@chamaeleon/extension-persist';
import { History, HistoryKey } from '@chamaeleon/extension-history';
import { AddBlockMenu } from '@chamaeleon/extension-add-block-menu';
import { ConfigurationDrawer } from '@chamaeleon/extension-configuration-drawer';
import {
  EditorContent,
  EditorProvider,
  useEditorSelector,
} from '@chamaeleon/react-editor';

import { Button } from '@chamaeleon/uikit';
import { Button as ButtonExtension } from './button';

const Content = () => {
  const [state, editor] = useEditorSelector(({ editor }) => editor.state);

  const historyState = HistoryKey.getState(state);

  const isStateEmpty = Object.keys(state.blocks).length === 0;

  return (
    <div>
      <div className="border-b">
        <div className="flex flex-col space-x-2 p-2 sm:flex-row">
          <div className="space-x-2">
            <Button color="secondary" onClick={() => editor.commands.undo()}>
              Undo
            </Button>

            <Button color="secondary" onClick={() => editor.commands.redo()}>
              Redo
            </Button>
          </div>

          <div className="flex items-center space-x-2 py-4 sm:py-0">
            <p className="inline text-base">
              Current version: {historyState.currentVersion + 1}
              {' / '}
              {historyState.supportedVersions}
            </p>

            <span>|</span>

            <p className="inline text-base">
              History stack: {historyState.historyTransactions.length}
            </p>
          </div>

          <div className="space-x-2">
            <Button color="secondary" onClick={() => editor.commands.persist()}>
              Persist
            </Button>

            <Button
              color="secondary"
              onClick={() => editor.commands.clearPersisted()}
            >
              Clear
            </Button>

            <Button
              color="secondary"
              onClick={() => {
                editor.commands.clearPersisted();
                window.location.reload();
              }}
            >
              Reload
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-2 p-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button
            color="secondary"
            disabled={!isStateEmpty}
            onClick={() => {
              editor.chain.addPage(null).select().run();
              editor.chain.addRow('root').select().run();
              editor.chain.addColumn(editor.state.activeId!).select().run();
              editor.chain.addRow('root').select().run();
            }}
          >
            Preset default
          </Button>

          <Button
            color="secondary"
            disabled={!isStateEmpty}
            onClick={() => {
              editor.chain.addPage(null).select().run();
              editor.chain.addRow('root').select().run();
              editor.chain.addRow('root').select().run();
              editor.chain.addRow('root').select().run();
            }}
          >
            Preset only rows
          </Button>

          <Button
            color="secondary"
            disabled={!isStateEmpty}
            onClick={() => {
              editor.chain.addPage(null).select().run();
              editor.chain.addRow('root').select().run();
              editor.chain.addRow('root').select().run();
              editor.chain.addRow('root').select().run();
              editor.chain.addColumn(editor.state.activeId!).run();
              editor.chain.addRow('root').select().run();
              editor.chain.addRow('root').select().run();
            }}
          >
            Preset rows with nested columns
          </Button>

          <Button
            color="secondary"
            disabled={!isStateEmpty}
            onClick={() => {
              editor.chain.addPage(null).select().run();
              editor.chain.addRow('root').select().run();
              editor.chain.addRow('root').select().run();
              editor.chain.addRow('root').select().run();
              editor.chain
                .addColumn(editor.state.activeId!)
                .addColumn(editor.state.activeId!)
                .addColumn(editor.state.activeId!)
                .run();
            }}
          >
            Preset row with columns
          </Button>
        </div>
      </div>

      <div className="px-5">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const editor = new Editor({
  extensions: [
    Persist.configure({
      // expireIn: 1 * 60 * 1000,
    }),
    History.configure({ limit: 100 }),
    AddBlockMenu,
    ConfigurationDrawer,
    ButtonExtension,
  ],
  logger: {
    enabled: true,
  },
});

// @ts-expect-error
const reduxDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

if (reduxDevToolsExtension) {
  const devTools = reduxDevToolsExtension.connect({});

  editor.on('transaction', ({ editor, transaction }) => {
    if (transaction.getMeta(HistoryKey)) {
      return devTools.send(
        `${transaction.getMeta(HistoryKey)}-transaction`,
        editor.state,
      );
    }

    devTools.send('transaction', editor.state);
  });
}

editor.on('update', ({ transaction }) => {
  console.log('update', {
    transaction,
    lastModifiedBlock: transaction.lastModifiedBlock,
    activeId: transaction.activeId,
    activeBlock: {
      id: transaction.activeBlock?.id,
      name: transaction.activeBlock?.type.name,
      children: transaction.activeBlock?.children.children,
    },
    blocks: Object.values(transaction.blocks).map((block) => ({
      id: block.id,
      name: block.type.name,
      props: block.props,
      style: block.style,
      children: block.children,
    })),
  });
});

export const Example = () => {
  useEffect(() => {
    editor.logger.init({
      element: '.log',
    });
  }, []);

  return (
    <EditorProvider value={editor}>
      <div className="flex flex-col">
        <div className="w-full">
          <Content />
        </div>

        <div className="log h-[1000px] overflow-scroll p-5"></div>
      </div>
    </EditorProvider>
  );
};
