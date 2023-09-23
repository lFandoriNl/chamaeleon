import ReactDOM from 'react-dom';
import clsx from 'clsx';

import { Button, ButtonGroup, PanelButton } from '@chameleon/uikit';

import { BlockExtension } from '../block-extension';
import { Block } from '../model';
import { Plugin, PluginKey } from '../state';
import { JSONContent } from '../types';

const columnMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
} as Record<number, string>;

declare module '..' {
  interface Commands<ReturnType> {
    row: {
      addRow: (target: Block['id'], props?: JSONContent['props']) => ReturnType;
    };
  }
}

export const Row = BlockExtension.create({
  name: 'row',

  allowContent: {
    name: ['column'],
  },

  withChildren: true,
  rootable: true,
  structural: true,

  addProperties() {
    return {
      columns: {
        default: 0,
        isRequired: true,
      },
    };
  },

  addCommands() {
    return {
      addRow: (target, props) => {
        return ({ chain }) => {
          chain.insertContent(target, {
            type: Row.name,
            props,
          });
        };
      },
    };
  },

  addBlockViews() {
    return {
      natural: ({ block, children }) => {
        return (
          <div
            className={clsx('e-row grid gap-4', columnMap[block.props.columns])}
          >
            {children}
          </div>
        );
      },
      editor: ({ block, children, editor }) => {
        if (block.children.isEmpty) {
          return (
            <PanelButton
              onClick={() => {
                editor.commands.intention(block.id, 'change-properties');
              }}
            >
              Click to open settings
            </PanelButton>
          );
        }

        return (
          <div
            className={clsx('e-row grid gap-4', columnMap[block.props.columns])}
          >
            {children}
          </div>
        );
      },
      palette: () => {
        return <div>Row</div>;
      },
    };
  },

  addPlugins() {
    const { editor } = this;

    return [
      new Plugin({
        key: new PluginKey('SelectCountColumn'),
        type: 'property-configuration',
        property: {
          name: 'children',
          applicable: {
            name: ['column'],
          },
        },

        view: (view) => ({
          update() {
            if (!view.propertyConfiguration.element) return null;

            const { state } = view;

            const handleChangeColumnCount = (count: number) => {
              if (!state.activeId) return;

              editor.chain
                .removeContent(state.activeId)
                .command(({ commands }) => {
                  Array(count)
                    .fill(0)
                    .forEach(() => {
                      if (!state.activeId) return;

                      commands.addColumn(state.activeId);
                    });
                })
                .changeProperty(state.activeId, 'columns', count)
                .select()
                .run();
            };

            return ReactDOM.createPortal(
              <div>
                <p className="text-lg">Select the number of columns</p>

                <div className="flex space-x-4 mb-5">
                  <ButtonGroup color="secondary" size="medium">
                    {Array(12)
                      .fill(0)
                      .map((_, i) => (
                        <Button
                          key={i}
                          onClick={() => handleChangeColumnCount(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                  </ButtonGroup>
                </div>
              </div>,
              view.propertyConfiguration.element,
            );
          },
        }),
      }),
    ];
  },
});
