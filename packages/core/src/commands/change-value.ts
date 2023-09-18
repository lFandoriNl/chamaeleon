import { Block } from '../model/block';
import { RawCommands } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    changeValue: {
      changeValue: (target: Block['id'], value: string) => ReturnType;
    };
  }
}

export const changeValue: RawCommands['changeValue'] =
  (target, value) =>
  ({ tr }) => {
    tr.changeProperty(target, 'value', value);
  };
