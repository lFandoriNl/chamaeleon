import { Command } from '../command-manager';

import { Block, BlockId, Page } from '../types';

export function createSetPageRootBlockCommand(
  newBlock: Block,
  target: BlockId,
): Command<Record<BlockId, Page>> {
  let oldValue = '';

  return {
    execute(context) {
      oldValue = context[target].props.children;
      context[target].props.children = newBlock.id;
    },
    undo(context) {
      context[target].props.children = oldValue;
    },
  };
}
