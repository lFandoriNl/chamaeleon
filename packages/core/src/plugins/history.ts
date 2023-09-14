import { Patch } from 'immer';
import { Plugin, PluginKey } from '../state/plugin';

type HistoryOptions = {
  limit: number;
};

export function history(options: HistoryOptions) {
  return new Plugin({
    key: new PluginKey('history'),

    state: {
      init() {
        const changes = new Map<
          number,
          {
            undo: Patch[];
            redo: Patch[];
          }
        >();

        const canUndo = false;
        const canRedo = false;

        return { changes, canUndo, canRedo };
      },
      apply(tr, value, oldState, newState) {
        tr();
      },
    },
  });
}
