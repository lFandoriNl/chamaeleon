import { Block } from '../block';
import { Block as BlockModel } from '../model';
import { JSONContent } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    column: {
      addColumn: (
        target: BlockModel['id'],
        props?: JSONContent['props'],
      ) => ReturnType;
    };
  }
}

export const Column = Block.create({
  name: 'column',

  allowContent: [],

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
      addColumn: (target, props) => {
        return ({ commands }) => {
          commands.insertContent(target, {
            type: Column.name,
            props,
          });
        };
      },
    };
  },
});
