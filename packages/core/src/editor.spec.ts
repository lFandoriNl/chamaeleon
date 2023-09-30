import { describe, it, beforeEach, expect } from 'vitest';

import { Editor } from './editor';

describe('EditorState', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      blocks: {},
    });
  });

  it('should insert page with default title', () => {
    editor.commands.addPage(null);

    editor.commands.select();

    expect(editor.state.activeBlock!.props.title).toBe(
      editor.schema.blockType('page').defaultProps!.title,
    );

    editor.commands.changeTitle(editor.state.activeId!, 'Page title');

    expect(editor.state.activeBlock!.props.title).toBe('Page title');
  });

  it('should insert page as children', () => {
    editor.commands.addPage(null);

    editor.commands.select();

    editor.commands.addPage(editor.state.activeId!, {
      title: 'Nested page',
    });

    editor.commands.select();

    editor.commands.changeTitle(editor.state.activeId!, 'Nested page');

    expect(editor.state.activeBlock!.props.title).toBe('Nested page');
  });

  it('should chain commands', () => {
    editor.chain.addPage(null).select().run();

    expect(editor.state.activeBlock!.props.title).toBe(
      editor.schema.blockType('page').defaultProps!.title,
    );
    expect(editor.state.activeId).toBe(editor.state.activeBlock!.id);
  });

  it('should chain commands without apply', () => {
    editor.chain.addPage(null).select();

    expect(editor.state.blocks).toEqual({});
    expect(editor.state.activeId).toEqual(null);
  });
});