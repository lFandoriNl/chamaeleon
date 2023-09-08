import { observer } from 'mobx-react-lite';

import { EditorProvider, Editor } from '@chameleon/react-editor';
import { EngineProvider, Engine } from '@chameleon/react-engine';

import { EditorRenderer } from './editor-renderer';

type RendererProps = {
  editor: Editor;
  engine: Engine;
};

export const EditorRendererContainer = observer(
  ({ editor, engine }: RendererProps) => {
    return (
      <EditorProvider value={editor}>
        <EngineProvider value={engine}>
          <EditorRenderer />
        </EngineProvider>
      </EditorProvider>
    );
  },
);

EditorRendererContainer.displayName = 'EditorRendererContainer';
