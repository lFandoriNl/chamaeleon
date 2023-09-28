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
        style?: JSONContent['style'],
      ) => ReturnType;
    };
  }
}

export const Column = BlockExtension.create({
  name: 'column',

  allowContent: {
    structural: true,
    withChildren: true,
    withValue: true,
  },

  addStyle() {
    return {
      root: {
        marginLeft: {},
      },
    };
  },

  addProperties() {
    return {};
  },

  addCommands() {
    return {
      addColumn: (target, props, style) => {
        return ({ commands }) => {
          commands.insertContent(target, {
            type: Column.name,
            props,
            style,
          });
        };
      },
    };
  },

  addBlockViews() {
    return {
      natural: ({ block, children }) => {
        return (
          <div className={clsx('e-column')} style={block.style.root}>
            {children}
          </div>
        );
      },
      editor: ({ block, children, editor }) => {
        const { ui } = editor.view;

        return (
          <ui.ActionsTooltip
            components={[
              {
                placement: 'top-end',
                component: (
                  <ui.ActionSettingsButton
                    onClick={(event) => {
                      editor.commands.intention(
                        block.id,
                        'change-properties',
                        event.nativeEvent,
                      );
                    }}
                  />
                ),
              },
              {
                placement: 'left',
                component: (
                  <ui.ActionAddBlockButton
                    onClick={(event) => {
                      editor.commands.intention(
                        block.id,
                        'add-block',
                        event.nativeEvent,
                      );
                    }}
                  />
                ),
              },
            ]}
          >
            {block.children.isEmpty ? (
              <ui.PanelButton style={block.style.root}>
                Empty column
              </ui.PanelButton>
            ) : (
              <div className={clsx('e-column')} style={block.style.root}>
                {children}
              </div>
            )}
          </ui.ActionsTooltip>
        );
      },
      palette: () => {
        return <div>Column</div>;
      },
    };
  },
});
