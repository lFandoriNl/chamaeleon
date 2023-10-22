import { useRef } from 'react';
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
                      'hover:block-highlight flex w-full justify-center border-2 border-dashed border-gray-500 bg-white p-5',
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
                className={clsx('e-column hover:block-highlight p-5', {
                  'available-drop': isAvailableDrop,
                  'dropzone-over': isOver,
                })}
                style={block.style.root}
              >
                <editor.view.Dropzone strategy="vertical">
                  {children}
                </editor.view.Dropzone>

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
