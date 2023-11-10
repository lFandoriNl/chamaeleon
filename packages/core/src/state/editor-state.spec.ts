import { describe, it, beforeEach, expect, vi } from 'vitest';

import { EditorState } from './editor-state';
import { Plugin } from './plugin';

import { Schema } from '../model/schema';

type AppendTransactionParameters = Parameters<
  NonNullable<Plugin['appendTransaction']>
>;

type AppendTransactionReturn = ReturnType<
  NonNullable<Plugin['appendTransaction']>
>;

describe('EditorState', () => {
  let state: EditorState;

  beforeEach(() => {
    state = EditorState.create({
      blocks: {},
      schema: new Schema({
        blocks: {
          page: {
            allowContent: {},
            props: {
              title: {
                default: 'Enter your page title',
              },
            },
          },
        },
      }),
    });
  });

  it('should insert new block via tr.insertContent', () => {
    const { tr } = state;

    const block = state.schema.block('page');

    const { activeId } = tr.insertContent(block.id, [block]).select();

    const newState = state.apply(tr);

    expect(newState.activeId).toBe(activeId);
    expect(newState.blocks[activeId!]).toEqual(block);
  });

  it('should insert new block via plugin.appendTransaction', () => {
    const block = state.schema.block('page');

    const appendedTransactionFirst = vi.fn<
      AppendTransactionParameters,
      AppendTransactionReturn
    >((_, oldState, state) => {
      const { tr } = state;

      if (oldState.blocks[block.id]?.id === block.id) return null;

      return tr.insertContent(block.id, [block]);
    });

    const appendedTransactionSecond = vi.fn<
      AppendTransactionParameters,
      AppendTransactionReturn
    >((_, oldState, state) => {
      return state.tr.select();
    });

    state = state.reconfigure({
      plugins: [
        {
          name: 'test1',
          appendTransaction: appendedTransactionFirst,
        },
        {
          name: 'test2',
          appendTransaction: appendedTransactionSecond,
        },
      ],
    });

    const { tr } = state;

    const newState = state.apply(tr);

    expect(newState.activeId).toBe(block.id);
    expect(newState.blocks[newState.activeId!]).toEqual(block);
    expect(appendedTransactionFirst).toBeCalledTimes(2);
    expect(appendedTransactionSecond).toBeCalledTimes(1);
  });
});
