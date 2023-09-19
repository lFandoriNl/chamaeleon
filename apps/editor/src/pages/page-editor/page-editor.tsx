import { observer } from 'mobx-react-lite';

import { Editor } from '@chameleon/core';
import {
  EditorProvider,
  useEditor,
  EditorContent,
} from '@chameleon/react-editor';
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
  extensions: [ConfigureMenuDrawer],
});

editor.commands.addPage(null);
editor.commands.select();

editor.commands.addRow(editor.state.activeId!);
editor.commands.select();

editor.commands.addColumn(editor.state.activeId!);
editor.commands.select();

editor.commands.addText(editor.state.activeId!, { value: 'Some Text' });
editor.commands.select();

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
