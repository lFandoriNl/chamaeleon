import { Plugin, Block, JSONContent } from '@chamaeleon/core';
import { useRef } from 'react';

declare module '@chamaeleon/core' {
  interface Commands<ReturnType> {
    text: {
      addText: (
        target: Block['id'],
        props?: JSONContent['props'],
        style?: JSONContent['style'],
      ) => ReturnType;
    };
  }
}

export function Text(): Plugin {
  return {
    name: 'text',
    apply(editor, { addCommands, addBlock }) {
      addCommands({
        addText: (target, props, style) => {
          return ({ commands }) => {
            commands.insertContent(target, {
              type: Text.name,
              props,
              style,
            });
          };
        },
      });

      addBlock({
        name: 'text',
        props: {
          content: {
            default: '',
          },
        },
        components: {
          view: ({ block }) => {
            return (
              <p className="e-text" style={block.style.root}>
                {block.props.value}
              </p>
            );
          },
          editor: ({ block }) => {
            const { ui } = editor.view;

            const referenceRef = useRef<HTMLButtonElement>(null);

            return (
              <editor.view.Block id={block.id} ref={referenceRef}>
                <textarea
                  className="e-text"
                  placeholder="Enter your text"
                  value={block.props.content}
                  style={block.style.root}
                  onChange={(event) => {
                    editor.commands.changeProperty(
                      block.id,
                      'content',
                      event.target.value,
                    );
                  }}
                />

                <ui.ActionPopover
                  referenceRef={referenceRef}
                  placement="top-start"
                >
                  <ui.DragButton />
                </ui.ActionPopover>

                <ui.ActionPopover
                  referenceRef={referenceRef}
                  placement="top-end"
                >
                  <ui.ActionSettingsButton
                    onClick={(event) => {
                      editor.commands.intention(
                        block.id,
                        'change-properties',
                        event.nativeEvent,
                      );
                    }}
                  />
                </ui.ActionPopover>
              </editor.view.Block>
            );
          },
          palette: () => {
            return <div>Text</div>;
          },
        },
      });
    },
  };
}
