import { Editor, Block } from '@chamaeleon/core';
import { Button } from '@chamaeleon/uikit';

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

        return view.render?.(...updateParams());
      })}
    </div>
  );
};

type EditorContentProps = {
  editor: Editor;
};

export const EditorContent = ({ editor }: EditorContentProps) => {
  const [rootPage] = useEditorSelector(({ editor }) => editor.state.rootPage);

  return (
    <editor.view.ExtensionProviders
      Renderer={(props: { block: Block }) => (
        <Renderer block={props.block} editor={editor} componentType="editor" />
      )}
      editor={editor}
    >
      <div className="editor-root">
        {rootPage ? (
          <Renderer block={rootPage} editor={editor} componentType="editor" />
        ) : (
          <div className="editor-root">
            <div className="flex justify-center p-10">
              <Button
                color="secondary"
                onClick={() => {
                  editor.chain.addPage(null).select().run();
                }}
              >
                Add first page
              </Button>
            </div>

            <EditorContentPortals />
          </div>
        )}

        <EditorContentPortals />
      </div>
    </editor.view.ExtensionProviders>
  );
};
