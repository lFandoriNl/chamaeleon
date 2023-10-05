import { describe, it, beforeEach, expect } from 'vitest';

import { Editor, Extension, Plugin } from '@chamaeleon/core';
import { History } from './history';

describe('History', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      blocks: {},
      extensions: [History],
    });
  });

  it('should simple undo redo transaction', () => {
    editor.chain.addPage(null).select().run();

    editor.chain
      .changeTitle(editor.state.activeId!, '1')
      .changeTitle(editor.state.activeId!, '12')
      .run();

    expect(editor.state.activeBlock?.props.title).toBe('12');

    editor.commands.undo();

    expect(
      editor.state.blocks[editor.state.lastModifiedBlock!].props.title,
    ).toBe('Enter your page title');

    editor.commands.redo();

    expect(
      editor.state.blocks[editor.state.lastModifiedBlock!].props.title,
    ).toBe('12');
  });

  it('should undo redo transactions with ignore unnecessary commands', () => {
    editor.chain.addPage(null).select().run();

    editor.commands.changeTitle(editor.state.activeId!, 'Title');

    editor.commands.addRow(editor.state.activeId!);

    const savedState = editor.state;

    editor.commands.undo();
    editor.commands.undo();
    editor.commands.undo();
    // this command should be ignored
    editor.commands.undo();

    expect(editor.state.blocks).toEqual({});

    editor.commands.redo();
    editor.commands.redo();
    editor.commands.redo();
    // this command should be ignored
    editor.commands.redo();

    expect(editor.state.blocks).toEqual(savedState.blocks);
    expect(editor.state.lastModifiedBlock).toEqual(
      savedState.lastModifiedBlock,
    );
  });

  it('should execute command with clear history transaction', () => {
    editor.chain.addPage(null).select().run();

    editor.commands.changeTitle(editor.state.activeId!, '1');
    editor.commands.changeTitle(editor.state.activeId!, '2');
    editor.commands.changeTitle(editor.state.activeId!, '3');
    editor.commands.changeTitle(editor.state.activeId!, '4');
    editor.commands.changeTitle(editor.state.activeId!, '5');

    editor.commands.undo(); // 4
    editor.commands.undo(); // 3
    editor.commands.undo(); // 2

    editor.commands.changeTitle(editor.state.lastModifiedBlock!, '6'); // 6

    editor.commands.redo(); // nothing

    expect(
      editor.state.blocks[editor.state.lastModifiedBlock!].props.title,
    ).toBe('6');

    editor.commands.changeTitle(editor.state.lastModifiedBlock!, '7');
    editor.commands.changeTitle(editor.state.lastModifiedBlock!, '8');

    editor.commands.undo(); // 7
    editor.commands.undo(); // 6
    editor.commands.undo(); // 2

    expect(
      editor.state.blocks[editor.state.lastModifiedBlock!].props.title,
    ).toBe('2');

    editor.commands.undo(); // 1

    expect(
      editor.state.blocks[editor.state.lastModifiedBlock!].props.title,
    ).toBe('1');

    editor.commands.changeTitle(editor.state.lastModifiedBlock!, '9'); // 9

    editor.commands.redo(); // nothing

    expect(
      editor.state.blocks[editor.state.lastModifiedBlock!].props.title,
    ).toBe('9');
  });

  it('should work with history limit', () => {
    editor = new Editor({
      blocks: {},
      extensions: [
        History.configure({
          limit: 3,
        }),
      ],
    });

    editor.chain.addPage(null).select().run();

    editor.commands.changeTitle(editor.state.activeId!, '1');
    editor.commands.changeTitle(editor.state.activeId!, '2');
    editor.commands.changeTitle(editor.state.activeId!, '3');
    editor.commands.changeTitle(editor.state.activeId!, '4');
    editor.commands.changeTitle(editor.state.activeId!, '5');

    editor.commands.undo();
    editor.commands.undo();
    editor.commands.undo();
    // this command should be ignored because of history limit is 3
    editor.commands.undo();

    expect(
      editor.state.blocks[editor.state.lastModifiedBlock!].props.title,
    ).toBe('2');

    editor.commands.redo();
    editor.commands.redo();
    editor.commands.redo();
    // this command should be ignored because of history limit is 3
    editor.commands.redo();

    expect(
      editor.state.blocks[editor.state.lastModifiedBlock!].props.title,
    ).toBe('5');
  });

  it('should work with history limit', () => {
    editor = new Editor({
      blocks: {},
      extensions: [
        History.configure({
          limit: 3,
        }),
      ],
    });

    editor.chain.addPage(null).select().run();

    editor.commands.changeTitle(editor.state.activeId!, '1');
    editor.commands.changeTitle(editor.state.activeId!, '2');
    editor.commands.changeTitle(editor.state.activeId!, '3');
    editor.commands.changeTitle(editor.state.activeId!, '4');
    editor.commands.changeTitle(editor.state.activeId!, '5');

    // [3, 4, 5] => 5

    editor.commands.undo();
    editor.commands.undo();
    editor.commands.undo();
    // this command should be ignored because of history limit is 3
    editor.commands.undo();

    // [-3, -4, -5] => 2

    expect(
      editor.state.blocks[editor.state.lastModifiedBlock!].props.title,
    ).toBe('2');

    editor.commands.redo(); // 3

    // [3, -4, -5] => 3

    editor.commands.changeTitle(editor.state.lastModifiedBlock!, '6');

    // [3, 6] => 6

    editor.commands.undo();
    editor.commands.undo();

    // [-3, -6] => 2

    expect(
      editor.state.blocks[editor.state.lastModifiedBlock!].props.title,
    ).toBe('2');
  });

  /**
   * TODO: This test fails because when executing the undo command,
   * appendTransaction is called, which adds a new command
   * as a result of which they cancel each other,
   * we need to come up with a mechanism so that appendTransaction
   * does not trigger on the undo redo commands
   */
  it('should undo transaction that was replayed via appendTransaction', () => {
    editor = new Editor({
      blocks: {},
      extensions: [
        History,
        Extension.create({
          addPlugins() {
            return [
              new Plugin({
                type: 'common',
                appendTransaction(transactions, oldState, state) {
                  if (transactions[0].getMeta('called')) {
                    return;
                  }

                  transactions[0].setMeta('called', true);

                  const lastModifiedBlock = transactions[0].lastModifiedBlock!;

                  return state.tr
                    .insertContent(
                      lastModifiedBlock,
                      editor.schema.block('row'),
                    )
                    .select();
                },
              }),
            ];
          },
        }),
      ],
    });

    editor.commands.addPage(null);

    editor.commands.undo();
    editor.commands.undo();

    expect(editor.state.blocks).toEqual({});
  });
});
