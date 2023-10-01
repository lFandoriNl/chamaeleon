import { Editor } from '@chamaeleon/core';
import { AddBlockMenu } from '@chamaeleon/extension-add-block-menu';
import { ConfigurationDrawer } from '@chamaeleon/extension-configuration-drawer';
import {
  EditorContent,
  EditorProvider,
  useEditor,
} from '@chamaeleon/react-editor';

const Content = () => {
  const editor = useEditor();

  return <EditorContent editor={editor} />;
};

const editor = new Editor({
  extensions: [AddBlockMenu, ConfigurationDrawer],
});

// @ts-expect-error
const reduxDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

if (reduxDevToolsExtension) {
  const devTools = reduxDevToolsExtension.connect({});

  editor.on('transaction', function test({ transaction }) {
    devTools.send('transaction', transaction);
  });
}

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
