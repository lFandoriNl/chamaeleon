import { Block } from '../block';
import { Block as BlockModel } from '../model';
import { JSONContent } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    page: {
      addPage: (
        target: BlockModel['id'] | null,
        props?: JSONContent['props'],
      ) => ReturnType;
    };
  }
}

export const Page = Block.create({
  name: 'page',

  allowContent: ['page'],

  addProperties() {
    return {
      title: {
        default: 'Enter your page title',
      },
    };
  },

  addCommands() {
    return {
      addPage: (target, props) => {
        return ({ commands }) => {
          commands.insertContent(target, {
            type: Page.name,
            props,
          });
        };
      },
    };
  },
});
