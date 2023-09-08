import { useEngine } from '@chameleon/react-engine';
import { EditorRenderBlock } from './editor-render-block';
import { observer } from 'mobx-react-lite';

export const EditorRenderer = observer(() => {
  const engine = useEngine();

  return (
    <div className="w-full h-full border border-gray-500">
      {engine.rootPageBlock && (
        <EditorRenderBlock blockId={engine.rootPageBlock.id} />
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
