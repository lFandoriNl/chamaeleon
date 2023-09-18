import { Editor } from '@chameleon/core';

import { Renderer } from './renderer';
import { PanelButton } from '@chameleon/uikit';
import { useEditorSelector } from './use-editor-subscribe';

type EditorContentProps = {
  editor: Editor;
};

export const EditorContent = ({ editor }: EditorContentProps) => {
  const rootPage = useEditorSelector(({ editor }) => editor.state.rootPage);

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
            Add root block
          </PanelButton>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-root">
      <Renderer block={rootPage} editor={editor} componentType="editor" />
    </div>
  );
};
