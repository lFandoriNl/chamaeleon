import { Extension } from '@chamaeleon/core';
import { StorageOptions } from './types';
import { StorageAdapter } from './storege-adapter';

declare module '@chamaeleon/core' {
  interface Commands<ReturnType> {
    history: {
      persist: () => ReturnType;
      clearPersisted: () => ReturnType;
    };
  }
}

type PersistOptions = StorageOptions & {
  persistedKey: string;
};

let storageAdapter!: StorageAdapter;

export const Persist = Extension.create<PersistOptions>({
  name: 'persist',

  addOptions() {
    return {
      persistedKey: '__chamaeleon_persisted__',
      storage: window.localStorage,
    };
  },

  addCommands({ options }) {
    return {
      persist: () => {
        return ({ editor }) => {
          storageAdapter.setItem(
            options.persistedKey,
            editor.state as unknown as Record<string, unknown>,
          );
        };
      },
      clearPersisted: () => {
        return () => {
          storageAdapter.removeItem(options.persistedKey);
        };
      },
    };
  },

  async init({ editor, options }) {
    storageAdapter = new StorageAdapter({
      expireIn: options.expireIn,
      storage: options.storage,
    });

    const data = await storageAdapter.getItem(options.persistedKey);

    const result = editor.state.fromJSON(data);

    if (!result.success) return;

    editor.view.updateState(result.state);
  },

  onTransaction({ editor, options }, { transaction }) {
    if (transaction.steps.length === 0) return;

    const { state } = editor;

    storageAdapter.setItem(
      options.persistedKey,
      state as unknown as Record<string, unknown>,
    );
  },
});
