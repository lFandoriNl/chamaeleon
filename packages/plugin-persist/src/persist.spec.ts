import { Editor, Plugin } from '@chamaeleon/core';
import { describe, it, expect, vi } from 'vitest';

import { Persist } from './persist';

describe('Persist', () => {
  const page: Plugin = {
    name: 'page',
    apply(_, { addBlock }) {
      addBlock({
        name: 'page',
      });
    },
  };

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
      plugins: [
        Persist({
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
          root: new Editor({
            plugins: [page],
          }).schema
            .block('page', undefined, undefined, [], 'root')
            .toJSON(),
        },
      },
    };

    storage.getItem.mockImplementation(() => stored);

    const editor = new Editor({
      blocks: {},
      plugins: [
        Persist({
          persistedKey,
          storage,
        }),
        page,
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
      plugins: [
        Persist({
          persistedKey,
          storage,
        }),
        page,
      ],
    });

    editor.on('ready', () => {
      editor.chain
        .insertContent(editor.schema.spec.rootBlockId, {
          id: editor.schema.spec.rootBlockId,
          type: 'page',
          props: {
            title: '',
          },
        })
        .select()
        .run();

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
      plugins: [
        Persist({
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
