import { useRef } from 'react';
import clsx from 'clsx';

import { Block, Plugin, JSONContent } from '@chamaeleon/core';

declare module '@chamaeleon/core' {
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

export function Row(): Plugin {
  const rowName = 'row';

  return {
    name: rowName,
    apply(editor, { addCommands, addBlock }) {
      addCommands({
        addRow: (target, props, style) => {
          return ({ commands }) => {
            commands.insertContent(target, {
              type: rowName,
              props,
              style,
            });
          };
        },
      });

      addBlock({
        name: rowName,
        allowContent: {
          name: ['column'],
        },
        withChildren: true,
        rootable: true,
        structural: true,
        style: {
          root: {
            rowGap: undefined,
            columnGap: undefined,
            gap: '16px',
            // marginTop: {},
            // marginRight: {},
            // marginBottom: {},
            // marginLeft: {},
            // margin: {},
          },
        },
        components: {
          view: ({ block, children }) => {
            return (
              <div className={clsx('e-row grid')} style={block.style.root}>
                {children}
              </div>
            );
          },
          editor: ({ block, children }) => {
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
                          'hover:block-highlight flex w-full grid-cols-12 justify-center bg-white p-5',
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
                  <editor.view.Dropzone>
                    <div
                      className={clsx(
                        'e-row hover:block-highlight grid w-full grid-cols-12 p-5',
                        {
                          'available-drop': isAvailableDrop,
                          'dropzone-over': isOver,
                        },
                      )}
                      style={block.style.root}
                    >
                      {children}

                      <div className="flex items-center justify-center py-2">
                        <ui.ActionAddBlockButton
                          onClick={() => editor.commands.addColumn(block.id)}
                        />
                      </div>
                    </div>
                  </editor.view.Dropzone>
                )}

                <ui.ActionPopover
                  referenceRef={referenceRef}
                  placement="top-start"
                >
                  <ui.DragButton />
                </ui.ActionPopover>

                <ui.ActionPopover
                  referenceRef={referenceRef}
                  placement="top-end"
                >
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
        },
      });
    },
  };
}
