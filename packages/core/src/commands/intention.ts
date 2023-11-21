import { Block } from '../model';
import { RawCommands } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    intention: {
      intention: (
        target: Block['id'],
        type: 'add-block' | 'change-properties',
        element?: HTMLElement,
      ) => ReturnType;
    };
  }
}

export const intention: RawCommands['intention'] =
  (target, type, element) =>
  ({ tr }) => {
    tr.setMeta('intention', { target, type, element });
  };
