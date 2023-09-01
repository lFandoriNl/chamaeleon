import { Command } from '../command-manager';

import { BlockId, StateContext } from '../types';
import { isContentEditingBlock } from '../utils';

export function createChangeContentCommand(
  target: BlockId,
  content: string,
): Command<StateContext> {
  let oldValue = '';

  return {
    execute(context) {
      const block = context.blocks[target];

      if (isContentEditingBlock(block)) {
        oldValue = block.props.content;
        block.props.content = content;
      }
    },
    undo(context) {
      const block = context.blocks[target];

      if (isContentEditingBlock(block)) {
        block.props.content = oldValue;
      }
    },
  };
}
