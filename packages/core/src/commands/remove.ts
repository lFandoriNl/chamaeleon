import { Block } from '../model';
import { RawCommands } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    remove: {
      remove: (target: Block['id']) => ReturnType;
    };
  }
}

export const remove: RawCommands['remove'] =
  (target) =>
  ({ tr }) => {
    tr.remove(target);
  };
