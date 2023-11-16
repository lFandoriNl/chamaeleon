import { Editor, Block } from '@chamaeleon/core';
import { Button } from '@chamaeleon/uikit';

import { Renderer } from './renderer';
import { useEditorSelector } from './use-editor-selector';

const EditorContentPortals = () => {
  // rerender after each state update
  const [_, editor] = useEditorSelector(() => ({}));

  return (
    <div className="editor-content-portals">
      {editor.view.pluginCommonViews.map(
        ({ id, view: { filter, component: Component } }) => {
          if (filter && !filter()) return null;

          return <Component key={id} editor={editor} />;
        },
      )}
    </div>
  );
};

type EditorContentProps = {
  editor: Editor;
  empty?: React.ReactElement;
};

export const EditorContent = ({ editor, empty }: EditorContentProps) => {
  const [rootPage] = useEditorSelector(({ editor }) => editor.state.rootPage);

  return (
    <editor.view.PluginProviders
      Renderer={(props: { block: Block }) => (
        <Renderer block={props.block} editor={editor} componentType="editor" />
      )}
      editor={editor}
    >
      <div className="editor-root">
        {rootPage ? (
          <Renderer block={rootPage} editor={editor} componentType="editor" />
        ) : (
          empty || (
            <div className="flex justify-center p-10">
              <Button
                color="secondary"
                onClick={() => {
                  editor.chain
                    .insertContent(editor.schema.spec.rootBlockId, {
                      id: editor.schema.spec.rootBlockId,
                      type: 'page',
                    })
                    .select()
                    .run();
                }}
              >
                Add first page
              </Button>
            </div>
          )
        )}

        <EditorContentPortals />
      </div>
    </editor.view.PluginProviders>
  );
};
