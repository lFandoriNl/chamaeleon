import { Block, Plugin, JSONContent } from '@chamaeleon/core';
import clsx from 'clsx';
import { useRef } from 'react';

import { AddBlockButton } from '../shared/builder-ui/add-block-button';
import { DragButton } from '../shared/builder-ui/drag-button';
import { SettingButton } from '../shared/builder-ui/settings-button';

const columnsMap = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-[span_7_/_span_7]',
  8: 'col-[span_8_/_span_8]',
  9: 'col-[span_9_/_span_9]',
  10: 'col-[span_10_/_span_10]',
  11: 'col-[span_11_/_span_11]',
  12: 'col-[span_12_/_span_12]',
} as Record<number, string>;

declare module '@chamaeleon/core' {
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

export function Column(): Plugin {
  const columnName = 'column';

  return {
    name: columnName,
    apply(_, { addCommands, addBlock }) {
      addCommands({
        addColumn: (target, props, style) => {
          return ({ commands }) => {
            commands.insertContent(target, {
              type: columnName,
              props,
              style,
            });
          };
        },
      });

      addBlock({
        name: columnName,
        allowContent: {
          name: ['*', '!page', '!column'],
        },
        props: {
          colSpan: {
            default: 6,
            isRequired: true,
          },
        },
        components: {
          view: ({ block, children }) => {
            return (
              <div
                className={clsx('e-column', columnsMap[block.props.colSpan])}
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
                  <div
                    className={clsx(
                      'e-column hover:block-highlight flex w-full items-center justify-center border-2 border-dashed border-gray-500 bg-white p-5',
                      columnsMap[block.props.colSpan],
                      {
                        'available-drop': isAvailableDrop,
                        'dropzone-over': isOver,
                      },
                    )}
                    style={block.style.root}
                  >
                    <editor.view.Dropzone>
                      <div>
                        <AddBlockButton
                          onClick={(event) => {
                            editor.commands.intention(
                              block.id,
                              'add-block',
                              event.currentTarget,
                            );
                          }}
                        />
                      </div>
                    </editor.view.Dropzone>
                  </div>
                ) : (
                  <editor.view.Dropzone>
                    <div
                      className={clsx(
                        'e-column hover:block-highlight p-5',
                        columnsMap[block.props.colSpan],
                        {
                          'available-drop': isAvailableDrop,
                          'dropzone-over': isOver,
                        },
                      )}
                      style={block.style.root}
                    >
                      {children}

                      <div className="flex justify-center p-4">
                        <AddBlockButton
                          onClick={(event) => {
                            editor.commands.intention(
                              block.id,
                              'add-block',
                              event.currentTarget,
                            );
                          }}
                        />
                      </div>
                    </div>
                  </editor.view.Dropzone>
                )}

                <ui.ActionPopover
                  referenceRef={referenceRef}
                  placement="top-start"
                >
                  <DragButton />
                </ui.ActionPopover>

                <ui.ActionPopover
                  referenceRef={referenceRef}
                  placement="top-end"
                >
                  <SettingButton
                    onClick={(event) => {
                      editor.commands.intention(
                        block.id,
                        'change-properties',
                        event.currentTarget,
                      );
                    }}
                  />
                </ui.ActionPopover>
              </editor.view.Block>
            );
          },
          palette: () => {
            return <div>Column</div>;
          },
        },
      });
    },
  };
}
