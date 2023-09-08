import React from 'react';
import { observer } from 'mobx-react-lite';

import { BlockId, RowBlock } from '@chameleon/engine';
import { useEngine } from '@chameleon/react-engine';

type EditorRowProps = {
  blockId: BlockId;
  children?: React.ReactNode[];
};

export const EditorRow = observer<EditorRowProps>(({ blockId, children }) => {
  const engine = useEngine();

  const block = engine.getBlock<RowBlock>(blockId);

  console.log({ children });

  return (
    <div className="grid">
      {children.length === 0 && <button>Select the number of columns</button>}
    </div>
  );
});

EditorRow.displayName = 'EditorRow';
