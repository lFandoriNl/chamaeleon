import { Block } from '../model';
import { RawCommands } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    removeContent: {
      removeContent: (
        target: Block['id'],
        ids?: Array<Block['id']>,
      ) => ReturnType;
    };
  }
}

export const removeContent: RawCommands['removeContent'] =
  (target, ids) =>
  ({ tr }) => {
    tr.removeContent(target, ids);
  };
