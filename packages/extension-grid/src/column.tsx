import { useRef } from 'react';
import clsx from 'clsx';

import { BlockExtension, Block, JSONContent } from '@chamaeleon/core';

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

export const Column = BlockExtension.create({
  name: 'column',

  allowContent: {
    structural: true,
    withChildren: true,
    withValue: true,
  },

  addProperties() {
    return {
      colSpan: {
        default: 6,
        isRequired: true,
      },
    };
  },

  addStyle() {
    return {
      root: {
        marginLeft: {},
      },
    };
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
                </div>
              </editor.view.Dropzone>
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
        return <div>Column</div>;
      },
    };
  },
});
