import { Command } from '../command-manager';

import { Block, BlockId } from '../types';
import { isContentEditingBlock } from '../utils';

export function createChangeContentCommand(
  target: BlockId,
  content: string,
): Command<Record<BlockId, Block>> {
  let oldValue = '';

  return {
    execute(context) {
      const block = context[target];

      if (isContentEditingBlock(block)) {
        oldValue = block.props.content;
        block.props.content = content;
      }
    },
    undo(context) {
      const block = context[target];

      if (isContentEditingBlock(block)) {
        block.props.content = oldValue;
      }
    },
  };
}
