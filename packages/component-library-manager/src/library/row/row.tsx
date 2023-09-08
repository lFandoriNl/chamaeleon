import React from 'react';
import { observer } from 'mobx-react-lite';

import { BlockId, RowBlock } from '@chameleon/engine';
import { useEngine } from '@chameleon/react-engine';

type RowProps = {
  blockId: BlockId;
  children?: React.ReactNode[];
};

export const Row = observer<RowProps>(({ blockId, children }) => {
  const engine = useEngine();

  const block = engine.getBlock<RowBlock>(blockId);

  console.log({ children });

  return <div className="grid"></div>;
});

Row.displayName = 'Row';
