import { observer } from 'mobx-react-lite';

import { EngineProvider, Engine } from '@chameleon/react-engine';

import { Renderer } from './renderer';

type RendererProps = {
  engine: Engine;
};

export const RendererContainer = observer(({ engine }: RendererProps) => {
  return (
    <EngineProvider value={engine}>
      <Renderer />
    </EngineProvider>
  );
});

RendererContainer.displayName = 'RendererContainer';
