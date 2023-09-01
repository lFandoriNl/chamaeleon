import { Command } from '../command-manager';

import { BlockId, Block, StateContext } from '../types';

export function createAddPageRootBlockCommand(
  target: BlockId,
  newBlock: Block,
): Command<StateContext> {
  let oldValue = '';

  return {
    execute(context) {
      context.blocks[newBlock.id] = newBlock;

      oldValue = context.pages[target].props.children;
      context.pages[target].props.children = newBlock.id;
    },
    undo(context) {
      delete context.blocks[newBlock.id];

      context.pages[target].props.children = oldValue;
    },
  };
}
