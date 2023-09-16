import { Block } from '../model/block';
import { RawCommands } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    changeTitle: {
      changeTitle: (target: Block['id'], title: string) => ReturnType;
    };
  }
}

export const changeTitle: RawCommands['changeTitle'] =
  (target, title) =>
  ({ tr }) => {
    tr.changeProperty(target, 'title', title);
  };
