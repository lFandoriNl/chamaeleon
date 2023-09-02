import { Command } from '../command-manager';

import { Block, BlockId, StateContext } from '../types';
import { isWithChildrenBlock } from '../type-guard';

export function createAddBlockCommand(
  target: BlockId,
  newBlock: Block,
): Command<StateContext> {
  return {
    execute(context) {
      const block = context.blocks[target];

      if (isWithChildrenBlock(block)) {
        block.props.children.push(newBlock.id);
        context.blocks[newBlock.id] = newBlock;
      }
    },
    undo(context) {
      const block = context.blocks[target];

      if (isWithChildrenBlock(block)) {
        block.props.children = block.props.children.filter(
          (id) => id !== newBlock.id,
        );

        delete context.blocks[newBlock.id];
      }
    },
  };
}
