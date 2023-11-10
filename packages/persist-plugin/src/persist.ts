import { Plugin } from '@chamaeleon/core';

import { StorageAdapter } from './storage-adapter';

import { StorageOptions } from './types';

declare module '@chamaeleon/core' {
  interface Commands<ReturnType> {
    persist: {
      persist: () => ReturnType;
      clearPersisted: () => ReturnType;
    };
  }
}

type PersistOptions = StorageOptions & {
  persistedKey?: string;
};

export function Persist(options: PersistOptions = {}): Plugin {
  let storageAdapter!: StorageAdapter;

  const persistedKey = options.persistedKey || '__chamaeleon_persisted__';
  const storage = options.storage || localStorage;

  return {
    name: 'persist',
    async init(editor) {
      storageAdapter = new StorageAdapter({
        expireIn: options.expireIn,
        storage: storage,
      });

      const data = await storageAdapter.getItem(persistedKey);

      const result = editor.state.fromJSON(data);

      if (!result.success) return;

      editor.view.updateState(result.state);
    },
    apply(editor, { addCommands }) {
      editor.on('transaction', ({ transaction }) => {
        if (transaction.steps.length === 0) return;

        const { state } = editor;

        storageAdapter.setItem(
          persistedKey,
          state as unknown as Record<string, unknown>,
        );
      });

      addCommands({
        persist: () => {
          return () => {
            storageAdapter.setItem(
              persistedKey,
              editor.state as unknown as Record<string, unknown>,
            );
          };
        },
        clearPersisted: () => {
          return () => {
            storageAdapter.removeItem(persistedKey);
          };
        },
      });
    },
  };
}
