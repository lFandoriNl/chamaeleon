import { observer } from 'mobx-react-lite';

import { Editor } from '@chameleon/core';
import {
  EditorProvider,
  useEditor,
  EditorContent,
} from '@chameleon/react-editor';
import { AddBlockMenu } from '@chameleon/extension-add-block-menu';
import { ConfigureMenuDrawer } from '@chameleon/extension-configure-menu-drawer';

import { Sidebar } from './sidebar';
import { AppBar } from './app-bar';

const Content = observer(() => {
  const editor = useEditor();

  return (
    <div className="border">
      {/* {engine.pagesArray.map((page) => (
        <h1 key={page.id} className="text-3xl font-semibold mb-4">
          {page.title}
        </h1>
      ))} */}

      <EditorContent editor={editor} />

      {/* {editor.ui.renderMode === 'preview' ? (
        <Renderer engine={engine} />
      ) : (
        <EditorRenderer editor={editor} engine={engine} />
      )} */}
    </div>
  );
});

Content.displayName = 'Content';

const editor = new Editor({
  extensions: [AddBlockMenu, ConfigureMenuDrawer],
  ui: {
    // ActionButton(props) {
    //   return (
    //     <button
    //       className={clsx(
    //         'ui-icon-button',
    //         'p-2 rounded-full shadow-xl',
    //         'bg-green-300 hover:bg-slate-300',
    //         'focus:outline-none focus:relative focus:ring focus:ring-blue-600',
    //         props.className,
    //       )}
    //       onClick={props.onClick}
    //     >
    //       {props.children}
    //     </button>
    //   );
    // },
  },
});

editor.on('update', ({ transaction }) => {
  console.log('update', {
    activeId: transaction.activeId,
    activeBlock: {
      id: transaction.activeBlock.id,
      name: transaction.activeBlock.type.name,
      children: transaction.activeBlock.children.children,
    },
    blocks: Object.values(transaction.blocks).map((block) => ({
      id: block.id,
      name: block.type.name,
      children: block.children,
    })),
  });
});

editor.chain.addPage(null).select().run();

// editor.chain.addRow(editor.state.activeId!).select().run();

// setTimeout(() => {
//   editor.commands.openConfiguration();
// }, 100);

// editor.chain.addColumn(editor.state.activeId!).select().run();

// editor.chain
//   .addText(editor.state.activeId!, { value: 'Some Text' })
//   .select()
//   .run();

// @ts-expect-error
window.editor = editor;

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

      {/* <DrawerBlockSettingsWidget /> */}
    </EditorProvider>
  );
};
