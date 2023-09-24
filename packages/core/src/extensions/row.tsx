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
        const { ui } = editor.view;

        return (
          <ui.ActionsTooltip
            className="row"
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
                show: block.children.isEmpty,
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
              <ui.PanelButton className="w-full">Empty row</ui.PanelButton>
            ) : (
              <div
                className={clsx(
                  'e-row w-full grid gap-4 hover:bg-slate-100',
                  columnMap[block.props.columns],
                )}
              >
                {children}

                <ui.AddExtraBlock
                  onClick={() => editor.commands.addColumn(block.id)}
                >
                  Add column
                </ui.AddExtraBlock>
              </div>
            )}
          </ui.ActionsTooltip>
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
          name: 'columns',
          applicable: {
            name: ['row'],
          },
        },

        view: (view) => ({
          update() {
            if (!view.propertyConfiguration.element) return null;

            const { state } = view;

            const handleChangeColumnCount = (count: number) => {
              if (!state.activeId) return;

              editor.commands.changeProperty(state.activeId, 'columns', count);
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
                          className={clsx({
                            'brightness-125':
                              state.activeBlock?.props.columns === i + 1,
                          })}
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
