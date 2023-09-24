import { RawCommands } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    select: {
      select: () => ReturnType;
    };
  }
}

export const select: RawCommands['select'] =
  () =>
  ({ tr }) => {
    tr.select();
  };
