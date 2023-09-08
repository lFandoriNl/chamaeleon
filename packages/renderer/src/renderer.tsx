import { useEngine } from '@chameleon/react-engine';
import { RenderBlock } from './render';
import { observer } from 'mobx-react-lite';

export const Renderer = observer(() => {
  const engine = useEngine();

  return (
    <>
      {engine.rootPageBlock && (
        <RenderBlock blockId={engine.rootPageBlock.id} />
      )}
    </>
  );
});

Renderer.displayName = 'Renderer';
