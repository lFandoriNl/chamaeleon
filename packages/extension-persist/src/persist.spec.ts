import { describe, it, expect, vi } from 'vitest';

import { Editor } from '@chamaeleon/core';
import { Persist } from './persist';

describe('Persist', () => {
  const persistedKey = 'testKey';

  const storage = {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  };

  it('should restore persisted state without applying', () => {
    storage.getItem.mockReturnValue({});

    const editor = new Editor({
      blocks: {},
      extensions: [
        Persist.configure({
          persistedKey,
          storage,
        }),
      ],
    });

    editor.on('ready', () => {
      expect(storage.getItem).toBeCalledWith(persistedKey);
      expect(storage.getItem).to.toReturnWith({});
      expect(storage.setItem).not.toBeCalled();
    });
  });

  it('should restore persisted state with applying', () => {
    const stored = {
      data: {
        blocks: {
          root: new Editor().schema
            .block('page', undefined, undefined, [], 'root')
            .toJSON(),
        },
      },
    };

    storage.getItem.mockImplementation(() => stored);

    const editor = new Editor({
      blocks: {},
      extensions: [
        Persist.configure({
          persistedKey,
          storage,
        }),
      ],
    });

    editor.on('ready', () => {
      expect(editor.state.toJSON().blocks).toEqual(stored.data.blocks);
    });
  });

  it('should persist state', () => {
    storage.setItem = vi.fn();

    const editor = new Editor({
      blocks: {},
      extensions: [
        Persist.configure({
          persistedKey,
          storage,
        }),
      ],
    });

    editor.on('ready', () => {
      editor.chain.addPage(null).select().run();

      expect(storage.setItem).toBeCalledWith(
        persistedKey,
        JSON.stringify({ data: editor.state }),
      );
    });
  });

  it('should remove persisted state', () => {
    storage.getItem = vi.fn(() => {
      // already expired
      return `{"expireAt":${Date.now() - 1}}`;
    });

    const editor = new Editor({
      blocks: {},
      extensions: [
        Persist.configure({
          persistedKey,
          storage,
        }),
      ],
    });

    editor.on('ready', () => {
      expect(storage.removeItem).toBeCalledWith(persistedKey);
    });
  });
});
