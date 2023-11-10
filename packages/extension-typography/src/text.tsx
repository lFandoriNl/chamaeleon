import { Plugin, Block, JSONContent } from '@chamaeleon/core';

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
        allowContent: {},
        withValue: true,
        props: {
          value: {
            default: 'Enter your text',
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
            return (
              <input
                className="e-text"
                placeholder="Enter your text"
                value={block.props.value}
                style={block.style.root}
                onChange={(event) => {
                  editor.commands.changeValue(block.id, event.target.value);
                }}
              />
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
