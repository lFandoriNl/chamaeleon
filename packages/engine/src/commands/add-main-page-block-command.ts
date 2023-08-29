import { Command } from '../command-manager';

import { Block, BlockId } from '../types';

export function createAddPageRootBlockCommand(
  newBlock: Block,
): Command<Record<BlockId, Block>> {
  return {
    execute(context) {
      context[newBlock.id] = newBlock;
    },
    undo(context) {
      delete context[newBlock.id];
    },
  };
}
