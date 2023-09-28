import { BlockExtension } from '../block-extension';
import { Block } from '../model';
import { JSONContent } from '../types';

declare module '..' {
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

export const Text = BlockExtension.create({
  name: 'text',

  allowContent: {},

  withValue: true,

  addProperties() {
    return {
      value: {
        default: 'Enter your text',
      },
    };
  },

  addCommands() {
    return {
      addText: (target, props, style) => {
        return ({ commands }) => {
          commands.insertContent(target, {
            type: Text.name,
            props,
            style,
          });
        };
      },
    };
  },

  addBlockViews() {
    return {
      natural: ({ block }) => {
        return (
          <p className="e-text" style={block.style.root}>
            {block.props.value}
          </p>
        );
      },
      editor: ({ block, editor }) => {
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
    };
  },
});
