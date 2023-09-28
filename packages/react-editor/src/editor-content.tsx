import { Editor } from '@chameleon/core';
import { PanelButton } from '@chameleon/uikit';

import { Renderer } from './renderer';
import { useEditorSelector } from './use-editor-selector';

const EditorContentPortals = () => {
  // rerender after each state update
  const [_, editor] = useEditorSelector(() => ({}));

  return (
    <div className="editor-content-portals">
      {Array.from(editor.view.pluginViews).map(([_, pluginView]) => {
        if (pluginView.type !== 'common') return null;

        const { renderRules, updateParams, view } = pluginView;

        const canRender = renderRules.conditionals
          .map((cond) => cond())
          .every(Boolean);

        if (!canRender) return null;

        return view.update?.(...updateParams());
      })}
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
              editor.chain.addPage(null).select().run();
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
    <div className="editor-root px-5">
      <Renderer block={rootPage} editor={editor} componentType="editor" />

      <EditorContentPortals />
    </div>
  );
};
