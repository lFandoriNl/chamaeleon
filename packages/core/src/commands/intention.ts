import { Block } from '../model';
import { RawCommands } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    intention: {
      intention: (
        target: Block['id'],
        type: 'add-block' | 'change-properties',
        event?: Event,
      ) => ReturnType;
    };
  }
}

export const intention: RawCommands['intention'] =
  (target, type, event) =>
  ({ tr }) => {
    tr.setMeta('intention', { target, type, event });
  };
