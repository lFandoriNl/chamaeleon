import { Editor } from '@chameleon/core';
import { PanelButton } from '@chameleon/uikit';

import { Renderer } from './renderer';
import { useEditorSelector } from './use-editor-subscribe';

const EditorContentPortals = () => {
  // rerender after each state update
  const [_, editor] = useEditorSelector(() => ({}));

  return (
    <div className="editor-content-portals">
      {editor.view.pluginViews.map(({ portal }) => portal)}
    </div>
  );
};

type EditorContentProps = {
  editor: Editor;
};

export const EditorContent = ({ editor }: EditorContentProps) => {
  const [rootPage] = useEditorSelector(({ editor }) => editor.state.rootPage);

  if (!rootPage) {
    return (
      <div className="editor-root">
        <div className="flex justify-center">
          <PanelButton
            onClick={() => {
              editor.commands.addPage(null);
              editor.commands.select();
            }}
          >
            Add first page
          </PanelButton>
        </div>

        <EditorContentPortals />
      </div>
    );
  }

  return (
    <div className="editor-root">
      <Renderer block={rootPage} editor={editor} componentType="editor" />

      <EditorContentPortals />
    </div>
  );
};
