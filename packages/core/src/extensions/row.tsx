import { useRef } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

import { Button, ButtonGroup } from '@chamaeleon/uikit';

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
      addRow: (
        target: Block['id'],
        props?: JSONContent['props'],
        style?: JSONContent['style'],
      ) => ReturnType;
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

  addStyle() {
    return {
      root: {
        margin: {},
        marginTop: {},
        marginRight: {},
        marginBottom: {},
        marginLeft: {},
      },
    };
  },

  addCommands() {
    return {
      addRow: (target, props, style) => {
        return ({ commands }) => {
          commands.insertContent(target, {
            type: Row.name,
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
          <div
            className={clsx('e-row grid gap-4', columnMap[block.props.columns])}
            style={block.style.root}
          >
            {children}
          </div>
        );
      },
      editor: ({ block, children, editor }) => {
        const { ui } = editor.view;

        const { isOver, isAvailableDrop } =
          editor.view.dragAndDrop.useBlockState(block);

        const referenceRef = useRef<HTMLElement>(null);

        return (
          <editor.view.Block id={block.id} ref={referenceRef}>
            {block.children.isEmpty ? (
              <div>
                <editor.view.Dropzone>
                  <div
                    className={clsx(
                      'hover:block-highlight flex w-full justify-center bg-white p-5',
                      'border-2 border-dashed border-gray-500',
                      {
                        'available-drop': isAvailableDrop,
                        'dropzone-over': isOver,
                      },
                    )}
                    style={block.style.root}
                  >
                    <ui.ActionAddBlockButton
                      onClick={(event) => {
                        editor.commands.intention(
                          block.id,
                          'add-block',
                          event.nativeEvent,
                        );
                      }}
                    />
                  </div>
                </editor.view.Dropzone>
              </div>
            ) : (
              <div
                className={clsx(
                  'e-row hover:block-highlight grid w-full gap-4 p-5',
                  columnMap[block.props.columns],
                  {
                    'available-drop': isAvailableDrop,
                    'dropzone-over': isOver,
                  },
                )}
                style={block.style.root}
              >
                <editor.view.Dropzone
                  strategy={block.props.columns === 1 ? 'vertical' : 'rect'}
                >
                  {children}
                </editor.view.Dropzone>

                <div className="flex items-center justify-center py-2">
                  <ui.ActionAddBlockButton
                    onClick={() => editor.commands.addColumn(block.id)}
                  />
                </div>
              </div>
            )}

            <ui.ActionPopover referenceRef={referenceRef} placement="top-start">
              <ui.DragButton />
            </ui.ActionPopover>

            <ui.ActionPopover referenceRef={referenceRef} placement="top-end">
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
        return <div>Row</div>;
      },
    };
  },

  addPlugins({ editor }) {
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

                <div className="mb-5 flex space-x-4">
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
