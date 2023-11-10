import { Plugin, Transaction } from '@chamaeleon/core';

declare module '@chamaeleon/core' {
  interface Commands<ReturnType> {
    history: {
      undo: () => ReturnType;
      redo: () => ReturnType;
    };
  }
}

type HistoryOptions = {
  limit?: number;
};

export type HistoryState = {
  historyTransactions: Transaction[];
  supportedVersions: number;
  currentVersion: number;
  canUndo: boolean;
  canRedo: boolean;
};

const getUndoRedoFlags = (
  state: Pick<HistoryState, 'historyTransactions' | 'currentVersion'>,
): Pick<HistoryState, 'canUndo' | 'canRedo'> => {
  const { historyTransactions, currentVersion } = state;

  return {
    canUndo: currentVersion !== -1,
    canRedo: currentVersion !== historyTransactions.length - 1,
  };
};

export const historyName = 'history';

export function History(options: HistoryOptions = {}): Plugin<HistoryState> {
  return {
    name: historyName,
    apply(_, { addCommands, getState }) {
      addCommands({
        undo: () => {
          return ({ tr, state, view }) => {
            tr.setMeta('preventDispatch', true);

            const { historyTransactions, currentVersion, canUndo } = getState();

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

            view.dispatch(invertedTr.setMeta(historyName, 'inverted'));
          };
        },
        redo: () => {
          return ({ tr, view }) => {
            tr.setMeta('preventDispatch', true);

            const { historyTransactions, currentVersion, canRedo } = getState();

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

            view.dispatch(appliedTr.setMeta(historyName, 'applied'));
          };
        },
      });
    },

    state: {
      init() {
        return {
          historyTransactions: [],
          currentVersion: -1,
          supportedVersions: options.limit || 1000,
          canUndo: false,
          canRedo: false,
        };
      },
      apply(tr, value) {
        if (tr.steps.length == 0 || tr.getMeta('preventHistory')) {
          return value;
        }

        if (tr.getMeta(historyName) === 'inverted') {
          const newCurrentVersion = value.currentVersion - 1;

          return {
            ...value,
            currentVersion: newCurrentVersion,
            ...getUndoRedoFlags({
              historyTransactions: value.historyTransactions,
              currentVersion: newCurrentVersion,
            }),
          };
        }

        if (tr.getMeta(historyName) === 'applied') {
          const newCurrentVersion = value.currentVersion + 1;

          return {
            ...value,
            currentVersion: newCurrentVersion,
            ...getUndoRedoFlags({
              historyTransactions: value.historyTransactions,
              currentVersion: newCurrentVersion,
            }),
          };
        }

        let newHistoryTransactions = [];
        let newCurrentVersion = -1;

        const hasUndoneTransaction =
          value.historyTransactions.length - 1 !== value.currentVersion;

        if (hasUndoneTransaction) {
          newHistoryTransactions = [
            ...value.historyTransactions.slice(0, value.currentVersion + 1),
            tr,
          ];
          newCurrentVersion = newHistoryTransactions.length - 1;
        } else {
          newHistoryTransactions = [...value.historyTransactions, tr];

          if (newHistoryTransactions.length > value.supportedVersions) {
            newHistoryTransactions = newHistoryTransactions.slice(1);
          }

          newCurrentVersion = newHistoryTransactions.length - 1;
        }

        return {
          historyTransactions: newHistoryTransactions,
          currentVersion: newCurrentVersion,
          supportedVersions: value.supportedVersions,
          ...getUndoRedoFlags({
            historyTransactions: newHistoryTransactions,
            currentVersion: newCurrentVersion,
          }),
        };
      },
    },
  };
}
