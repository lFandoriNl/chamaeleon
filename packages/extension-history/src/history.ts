import { Extension } from '@chamaeleon/core';
import { history, HistoryKey } from './history-plugin';

declare module '@chamaeleon/core' {
  interface Commands<ReturnType> {
    history: {
      undo: () => ReturnType;
      redo: () => ReturnType;
    };
  }
}

export const History = Extension.create({
  name: 'history',

  addOptions() {
    return {
      limit: 100,
    };
  },

  addCommands() {
    return {
      undo: () => {
        return ({ tr, state, view }) => {
          tr.setMeta('preventDispatch', true);

          const { historyTransactions, currentVersion, canUndo } =
            HistoryKey.getState(state);

          if (!canUndo) return;

          const trFromHistory = historyTransactions[currentVersion];

          const invertedTr = trFromHistory.steps.reduceRight((tr, step) => {
            const result = step.invert(tr.blocks);

            if (result.failed) {
              return tr;
            }

            tr.blocks = result.blocks!;
            tr.lastModifiedBlock = tr.blocks[state.schema.spec.rootBlockId]
              ? step.meta.changed
              : null;
            tr.activeId = null;

            return tr;
          }, trFromHistory);

          view.dispatch(invertedTr.setMeta(HistoryKey, 'inverted'));
        };
      },
      redo: () => {
        return ({ tr, state, view }) => {
          tr.setMeta('preventDispatch', true);

          const { historyTransactions, currentVersion, canRedo } =
            HistoryKey.getState(state);

          if (!canRedo) return;

          const currentVersionShift = currentVersion + 1;

          const trFromHistory =
            historyTransactions[
              currentVersionShift === -1 ? 0 : currentVersionShift
            ];

          const appliedTr = trFromHistory.steps.reduce((tr, step) => {
            const result = step.apply(tr.blocks);

            if (result.failed) {
              return tr;
            }

            tr.blocks = result.blocks!;
            tr.lastModifiedBlock = step.meta.changed;
            tr.activeId = null;

            return tr;
          }, trFromHistory);

          view.dispatch(appliedTr.setMeta(HistoryKey, 'applied'));
        };
      },
    };
  },

  addPlugins({ options }) {
    return [history(options)];
  },
});
