import { useEngine } from '@chameleon/react-engine';
import { RenderBlock } from './render';
import { observer } from 'mobx-react-lite';

export const EditorRenderer = observer(() => {
  const engine = useEngine();

  return (
    <div className="w-full h-full border border-gray-500">
      {engine.rootPageBlock && (
        <RenderBlock blockId={engine.rootPageBlock.id} />
      )}

      {!engine.rootPageBlock && (
        <button
          onClick={() => {
            engine.addRootPageBlock('row');
          }}
        >
          Add root block
        </button>
      )}
    </div>
  );
});

EditorRenderer.displayName = 'EditorRenderer';
