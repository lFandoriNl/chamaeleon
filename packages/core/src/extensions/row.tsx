import { Block } from '../block';
import { Block as BlockModel } from '../model';
import { JSONContent } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    row: {
      addRow: (
        target: BlockModel['id'],
        props?: JSONContent['props'],
      ) => ReturnType;
    };
  }
}

export const Row = Block.create({
  name: 'row',

  allowContent: ['column'],

  addProperties() {
    return {
      columns: {
        default: 2,
        isRequired: true,
      },
    };
  },

  addCommands() {
    return {
      addRow: (target, props) => {
        return ({ commands }) => {
          commands.insertContent(target, {
            type: Row.name,
            props,
          });
        };
      },
    };
  },

  addBlockViews() {
    return {
      natural: ({ block, Children }) => {
        return (
          <div className="grid">
            <Children id={block.id} />
          </div>
        );
      },
      editor: ({ block, Children }) => {
        return (
          <div className="grid">
            <Children id={block.id} />
          </div>
        );
      },
      palette: () => {
        return <div>Row</div>;
      },
    };
  },
});
