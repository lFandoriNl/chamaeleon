import React from 'react';
import { observer } from 'mobx-react-lite';

import { TextBlock } from '@chameleon/engine';
import { BlockId, useEngine } from '@chameleon/react-engine';

type TextProps = {
  blockId: BlockId;
  children?: React.ReactNode;
};

export const Text = observer<TextProps>(({ blockId }) => {
  const engine = useEngine();

  const block = engine.getBlock<TextBlock>(blockId);

  return <p className="text-base">{block.props.content}</p>;
});

Text.displayName = 'Text';
