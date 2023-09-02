import { blockConfig } from './block-config';
import {
  Block,
  NestableBlock,
  ClickableBlock,
  WithContentEditBlock,
} from './types';

export function isTypedBlock<T extends Block>(
  type: Block['type'],
  block: Block,
): block is T {
  return block.type === type;
}

export function isWithChildrenBlock<T extends NestableBlock>(
  block: Block,
): block is T {
  // @ts-expect-error
  return Boolean(block.props.children);
}

export function isClickableBlock<T extends ClickableBlock>(
  block: Block,
): block is T {
  return blockConfig.getBlocksByTag('clickable').includes(block.type);
}

export function isContentEditingBlock<T extends WithContentEditBlock>(
  block: Block,
): block is T {
  return blockConfig.getBlocksByTag('content-editing').includes(block.type);
}
