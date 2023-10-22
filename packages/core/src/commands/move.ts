import { Block } from '../model';
import { RawCommands } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    move: {
      move: (
        source: Block['id'],
        target: Block['id'],
        from: number,
        to: number,
      ) => ReturnType;
    };
  }
}

export const move: RawCommands['move'] =
  (source, target, from, to) =>
  ({ tr }) => {
    tr.move(source, target, from, to);
  };
