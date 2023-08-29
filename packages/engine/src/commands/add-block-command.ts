import { Command } from '../command-manager';

import { Block, BlockId } from '../types';
import { isBlockWithChildren } from '../utils';

export function createAddBlockCommand(
  newBlock: Block,
  to: BlockId,
): Command<Record<BlockId, Block>> {
  return {
    execute(context) {
      const block = context[to];

      if (isBlockWithChildren(block)) {
        block.props.children.push(newBlock.id);
        context[newBlock.id] = block;
      }
    },
    undo(context) {
      const block = context[to];

      if (isBlockWithChildren(block)) {
        block.props.children = block.props.children.filter(
          (id) => id !== newBlock.id,
        );

        delete context[newBlock.id];
      }
    },
  };
}
