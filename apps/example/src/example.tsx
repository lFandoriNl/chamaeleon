import { Editor } from '@chamaeleon/core';
import { History, HistoryKey } from '@chamaeleon/extension-history';
import { AddBlockMenu } from '@chamaeleon/extension-add-block-menu';
import { ConfigurationDrawer } from '@chamaeleon/extension-configuration-drawer';
import {
  EditorContent,
  EditorProvider,
  useEditorSelector,
} from '@chamaeleon/react-editor';

import { Button } from '@chamaeleon/uikit';

const Content = () => {
  const [state, editor] = useEditorSelector(({ editor }) => editor.state);

  const historyState = HistoryKey.getState(state);

  return (
    <div>
      <div className="flex flex-row p-2 border-b space-x-2">
        <div className="space-x-2">
          <Button color="secondary" onClick={() => editor.commands.undo()}>
            Undo
          </Button>

          <Button color="secondary" onClick={() => editor.commands.redo()}>
            Redo
          </Button>
        </div>

        <div className="flex items-center space-x-2">
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
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

const editor = new Editor({
  extensions: [
    History.configure({ limit: 10 }),
    AddBlockMenu,
    ConfigurationDrawer,
  ],
});

// @ts-expect-error
const reduxDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

if (reduxDevToolsExtension) {
  const devTools = reduxDevToolsExtension.connect({});

  editor.on('transaction', ({ editor, transaction }) => {
    if (transaction.getMeta(HistoryKey)) {
      return devTools.send(`${transaction.getMeta(HistoryKey)}-transaction`, {
        ...editor.state,
      });
    }

    devTools.send('transaction', { ...editor.state });
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

// editor.chain.addPage(null).select().run();

// editor.chain.addRow(editor.state.activeId!).select().run();

export const Example = () => {
  return (
    <EditorProvider value={editor}>
      <div className="flex">
        <div className="w-full">
          <Content />
        </div>
      </div>
    </EditorProvider>
  );
};
