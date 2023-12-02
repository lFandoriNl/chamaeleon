import { Editor, Block } from '@chamaeleon/core';

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
  const [mode] = useEditorSelector(({ editor }) => editor.mode);

  return (
    <editor.view.PluginProviders
      Renderer={(props: { block: Block }) => (
        <Renderer block={props.block} editor={editor} componentType={mode} />
      )}
      editor={editor}
    >
      {rootPage ? (
        <Renderer block={rootPage} editor={editor} componentType={mode} />
      ) : (
        empty
      )}

      <EditorContentPortals />
    </editor.view.PluginProviders>
  );
};
