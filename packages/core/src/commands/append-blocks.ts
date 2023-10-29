import { Block } from '../model';
import { RawCommands } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    appendBlocks: {
      appendBlocks: (
        target: Block['id'],
        blocks: Array<Block | Block['id']>,
      ) => ReturnType;
    };
  }
}

export const appendBlocks: RawCommands['appendBlocks'] =
  (target, blocks) =>
  ({ tr }) => {
    tr.insertContent(target, blocks);
  };
