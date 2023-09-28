import { Patch } from 'immer';
import { Plugin, PluginKey } from '../state';

type HistoryOptions = {
  limit: number;
};

export function history(options: HistoryOptions) {
  return new Plugin({
    key: new PluginKey('history'),

    type: 'common',

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

        const currentVersion = -1;
        const supportedVersions = options.limit;

        return {
          currentVersion,
          supportedVersions,
          changes,
          canUndo,
          canRedo,
        };
      },
      apply() {},
    },
  });
}
