import { Command } from '../command-manager';

import { Block, BlockId, Page } from '../types';

export function createSetPageRootBlockCommand(
  newBlock: Block,
  to: BlockId,
): Command<Record<BlockId, Page>> {
  return {
    execute(context) {
      context[to].props.children = newBlock.id;
    },
    undo(context) {
      context[to].props.children = '';
    },
  };
}
