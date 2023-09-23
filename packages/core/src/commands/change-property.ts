import { Block } from '../model/block';
import { RawCommands } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    changeProperty: {
      changeProperty: (
        target: Block['id'],
        property: string,
        value: any,
      ) => ReturnType;
    };
  }
}

export const changeProperty: RawCommands['changeProperty'] =
  (target, property, value) =>
  ({ tr }) => {
    tr.changeProperty(target, property, value);
  };
