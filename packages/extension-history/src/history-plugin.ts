import { Plugin, PluginKey, Transaction } from '@chamaeleon/core';

type HistoryOptions = {
  limit: number;
};

type HistoryState = {
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

export const HistoryKey = new PluginKey<HistoryState>('History');

export function history(options: HistoryOptions) {
  return new Plugin<HistoryState>({
    key: HistoryKey,

    type: 'common',

    state: {
      init() {
        return {
          historyTransactions: [],
          currentVersion: -1,
          supportedVersions: options.limit,
          canUndo: false,
          canRedo: false,
        };
      },
      apply(tr, value) {
        if (tr.steps.length == 0) {
          return value;
        }

        if (tr.getMeta(HistoryKey) === 'inverted') {
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

        if (tr.getMeta(HistoryKey) === 'applied') {
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
  });
}
