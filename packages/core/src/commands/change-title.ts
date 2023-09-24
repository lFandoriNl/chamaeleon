import { Block } from '../model';
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
  ({ commands }) => {
    commands.changeProperty(target, 'title', title);
  };
