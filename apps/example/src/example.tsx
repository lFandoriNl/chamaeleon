import { useEffect, useRef } from 'react';

import { Editor } from '@chamaeleon/core';
import { Page } from '@chamaeleon/extension-page';
import { GridPack } from '@chamaeleon/extension-grid';
import { Text } from '@chamaeleon/extension-typography';
import { Persist } from '@chamaeleon/extension-persist';
import {
  History,
  historyName,
  HistoryState,
} from '@chamaeleon/extension-history';
import { AddBlockMenu } from '@chamaeleon/extension-add-block-menu';
import { ConfigurationDrawer } from '@chamaeleon/extension-configuration-drawer';
import {
  EditorContent,
  EditorProvider,
  useEditorSelector,
} from '@chamaeleon/react-editor';

import { ChamaeleonDevtools } from '@chamaeleon/devtools';

import { Button } from '@chamaeleon/uikit';
import { Button as ButtonPlugin } from './button';

const Content = () => {
  const [state, editor] = useEditorSelector(({ editor }) => editor.state);

  const historyState = editor.getPluginState<HistoryState>(historyName);

  const isStateEmpty = Object.keys(state.blocks).length === 0;

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (drawerRef.current) {
      editor.setPluginState(ConfigurationDrawer(), (prev) => ({
        ...prev,
        element: drawerRef.current!,
      }));
    }
  }, []);

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

      <div className="relative flex">
        <div className="flex-1 px-5">
          <EditorContent editor={editor} />
        </div>

        <div ref={drawerRef} className="sticky top-0 self-start" />
      </div>
    </div>
  );
};

const editor = new Editor({
  plugins: [
    Persist({
      // expireIn: 1 * 60 * 1000,
    }),
    History({ limit: 100 }),
    AddBlockMenu(),
    ConfigurationDrawer(),
    Page(),
    GridPack,
    Text(),
    ButtonPlugin(),
  ],
  loggers: [
    ChamaeleonDevtools.logger,
    // {
    //   ...console,
    //   action: (data) => console.log(data),
    //   system: (data) => console.log(data),
    // },
  ],
});

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
  return (
    <EditorProvider value={editor}>
      <div className="flex flex-col">
        <Content />
      </div>

      <ChamaeleonDevtools.Render />
    </EditorProvider>
  );
};
