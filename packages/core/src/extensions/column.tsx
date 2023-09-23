import clsx from 'clsx';
import { BlockExtension } from '../block-extension';
import { Block } from '../model';
import { JSONContent } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    column: {
      addColumn: (
        target: Block['id'],
        props?: JSONContent['props'],
      ) => ReturnType;
    };
  }
}

export const Column = BlockExtension.create({
  name: 'column',

  allowContent: {},

  addProperties() {
    return {};
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

  addBlockViews() {
    return {
      natural: ({ block, children }) => {
        return <div className={clsx('e-column')}>{children}</div>;
      },
      editor: ({ block, children }) => {
        return (
          <div
            tabIndex={1}
            className={clsx(
              'e-column',
              block.children.isEmpty &&
                'min-h-[64px] p-4 flex items-center justify-center rounded-xl text-white bg-gray-300',
              block.children.isEmpty &&
                'hover:cursor-pointer hover:bg-gray-400 focus:relative focus:ring focus:ring-blue-600',
            )}
          >
            {block.children.isEmpty ? (
              <p className="text-base">Click to insert blocks</p>
            ) : (
              children
            )}
          </div>
        );
      },
      palette: () => {
        return <div>Row</div>;
      },
    };
  },
});
