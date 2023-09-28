import { Editor } from '@chameleon/core';
import {
  EditorProvider,
  useEditor,
  EditorContent,
} from '@chameleon/react-editor';
import { AddBlockMenu } from '@chameleon/extension-add-block-menu';
import { ConfigureDrawer } from '@chameleon/extension-configure-drawer';

import { Sidebar } from './sidebar';
import { AppBar } from './app-bar';

const Content = () => {
  const editor = useEditor();

  return <EditorContent editor={editor} />;
};

const editor = new Editor({
  extensions: [AddBlockMenu, ConfigureDrawer],
});

// @ts-expect-error
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({});

// devTools.init({ value: 'initial state' });

editor.on('transaction', function test({ transaction }) {
  devTools.send('transaction', transaction);
});

editor.on('update', ({ transaction }) => {
  console.log('update', {
    transaction,
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

export const PageEditor = () => {
  return (
    <EditorProvider value={editor}>
      <div className="flex">
        <Sidebar />

        <div className="w-full">
          <AppBar />

          <Content />
        </div>
      </div>
    </EditorProvider>
  );
};
