import React from 'react';
import { observer } from 'mobx-react-lite';

import { TextBlock } from '@chameleon/engine';
import { BlockId, useEngine } from '@chameleon/react-engine';

type EditorTextProps = {
  blockId: BlockId;
  children?: React.ReactNode;
};

export const EditorText = observer<EditorTextProps>(({ blockId }) => {
  const engine = useEngine();

  console.log(blockId);
  engine.debugBlocks();

  const block = engine.getBlock<TextBlock>(blockId);

  return <p className="text-base">{block.props.content}</p>;
});

EditorText.displayName = 'EditorText';
