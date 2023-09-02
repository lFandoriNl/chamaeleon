import { observer } from 'mobx-react-lite';
import { App } from './app';
import { EngineProvider, Engine } from '@chameleon/react-engine';

import './index.css';

type RendererProps = {
  engine: Engine;
};

export const Renderer = observer(({ engine }: RendererProps) => {
  return (
    <EngineProvider value={engine}>
      <App />
    </EngineProvider>
  );
});

Renderer.displayName = 'Renderer';
