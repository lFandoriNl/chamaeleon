import { observer } from 'mobx-react-lite';
import { EngineProvider, Engine } from '@chameleon/react-engine';

import { EditorRenderer } from './editor-renderer';

import './index.css';

type RendererProps = {
  engine: Engine;
};

export const EditorRendererContainer = observer(({ engine }: RendererProps) => {
  return (
    <EngineProvider value={engine}>
      <EditorRenderer />
    </EngineProvider>
  );
});

EditorRendererContainer.displayName = 'EditorRendererContainer';
