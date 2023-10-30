import { Block, Style } from '../model';
import { RawCommands } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    changeStyle: {
      changeStyle: (
        target: Block['id'],
        layer: keyof Style,
        style: NonNullable<Style[string]>,
      ) => ReturnType;
    };
  }
}

export const changeStyle: RawCommands['changeStyle'] =
  (target, layer, style) =>
  ({ tr }) => {
    tr.changeStyle(target, layer, style);
  };
