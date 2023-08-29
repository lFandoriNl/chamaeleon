import { Block, BlockWithChildren } from './types';

export function isBlockTyped<T extends Block>(
  type: Block['type'],
  block: Block,
): block is T {
  return block.type === type;
}

export function isBlockWithChildren<T extends BlockWithChildren>(
  block: Block,
): block is T {
  // @ts-expect-error
  return Boolean(block.props.children);
}
