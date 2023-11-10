import { describe, it, beforeEach, expect } from 'vitest';

import { Editor } from './editor';

describe('Editor', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      blocks: {},
      plugins: [
        {
          name: 'page',
          apply(_, { addBlock }) {
            addBlock({
              name: 'page',
              props: {
                title: {
                  default: '',
                },
              },
            });
          },
        },
      ],
    });
  });

  it('should insert page with default title', () => {
    editor.commands.insertContent(editor.schema.spec.rootBlockId, {
      id: editor.schema.spec.rootBlockId,
      type: 'page',
      props: {
        title: '',
      },
    });

    editor.commands.select();

    expect(editor.state.activeBlock!.props.title).toBe(
      editor.schema.blockType('page').defaultProps!.title,
    );

    editor.commands.changeTitle(editor.state.activeId!, 'Page title');

    expect(editor.state.activeBlock!.props.title).toBe('Page title');
  });

  it('should insert page as children', () => {
    editor.commands.insertContent(editor.schema.spec.rootBlockId, {
      id: editor.schema.spec.rootBlockId,
      type: 'page',
      props: {
        title: '',
      },
    });

    editor.commands.select();

    editor.commands.insertContent(editor.state.activeId!, {
      type: 'page',
      props: {
        title: 'Nested page',
      },
    });

    editor.commands.select();

    editor.commands.changeTitle(editor.state.activeId!, 'Nested page');

    expect(editor.state.activeBlock!.props.title).toBe('Nested page');
  });

  it('should chain commands', () => {
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

    expect(editor.state.activeBlock!.props.title).toBe(
      editor.schema.blockType('page').defaultProps!.title,
    );
    expect(editor.state.activeId).toBe(editor.state.activeBlock!.id);
  });

  it('should chain commands without apply', () => {
    editor.chain
      .insertContent(editor.schema.spec.rootBlockId, {
        id: editor.schema.spec.rootBlockId,
        type: 'page',
        props: {
          title: '',
        },
      })
      .select();

    expect(editor.state.blocks).toEqual({});
    expect(editor.state.activeId).toEqual(null);
  });
});
