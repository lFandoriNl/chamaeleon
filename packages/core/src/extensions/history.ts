import { Extension } from '../extension';
import { history } from '../plugins/history';

declare module '..' {
  interface Commands<ReturnType> {
    history: {
      undo: () => ReturnType;
      redo: () => ReturnType;
    };
  }
}

export const History = Extension.create({
  name: 'history',

  addCommands() {
    return {
      undo: () => {
        return () => {};
      },
      redo: () => {
        return () => {};
      },
    };
  },

  addPlugins() {
    return [history({ limit: 3 })];
  },
});
