import { useRef, useState } from 'react';
import clsx from 'clsx';

import {
  BlockExtension,
  Block,
  Plugin,
  PluginKey,
  JSONContent,
} from '@chamaeleon/core';

import { Button, Input } from '@chamaeleon/uikit';

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

const splitColumns = (template: string) => {
  return template.split('+').map(Number).filter(Boolean);
};

const TemplateButton = ({
  className,
  template,
  onClick,
}: {
  className?: string;
  template: string;
  onClick: (value: number[]) => void;
}) => {
  const templateColumns = splitColumns(template);

  if (templateColumns.length === 0) return null;

  return (
    <button
      key={template}
      className={clsx('group flex w-1/5 flex-col items-center p-2', className)}
      onClick={() => onClick(templateColumns)}
    >
      <div className="mb-1 w-full rounded-lg bg-gray-100 p-2 transition group-hover:bg-blue-200 group-hover:outline-none group-hover:ring-1 group-hover:ring-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="fill-slate-500 group-hover:fill-blue-700"
          width="100%"
          height="25"
          viewBox="0 0 125 40"
        >
          {templateColumns.map((columnSize, index, array) => {
            const calcX = (index: number): number => {
              if (index === 0) return 0;

              return array[index - 1] * 10 + calcX(index - 1);
            };

            const offset = 5;

            return (
              <rect
                key={index}
                width={columnSize * 10 - offset}
                height="40"
                x={calcX(index) + offset}
                fillOpacity={index % 2 === 0 ? '.3' : '.6'}
                rx="5"
              />
            );
          })}
        </svg>
      </div>

      <div className="text-xs group-hover:text-blue-700">{template}</div>
    </button>
  );
};

export const Row = BlockExtension.create({
  name: 'row',

  allowContent: {
    name: ['column'],
  },

  withChildren: true,
  rootable: true,
  structural: true,

  addStyle() {
    return {
      root: {
        rowGap: {},
        columnGap: {},
        gap: {
          default: '16px',
        },
        marginTop: {},
        marginRight: {},
        marginBottom: {},
        marginLeft: {},
        margin: {},
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
          <div className={clsx('e-row grid')} style={block.style.root}>
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
          propertyMatch: false,
          applicable: {
            name: ['row'],
          },
        },
        view: ({ view }) => ({
          render() {
            const { state } = view;

            const [value, setValue] = useState('');

            const handleChangeTemplate = (columns: number[]) => {
              const { activeBlock } = state;

              if (!activeBlock) return;

              editor.commands.command(({ commands }) => {
                if (activeBlock.children.isEmpty) {
                  columns.forEach((columnSize) => {
                    commands.addColumn(activeBlock.id, {
                      colSpan: columnSize,
                    });
                  });
                } else {
                  columns.forEach((columnSize, index) => {
                    const childId = activeBlock.children.at(index);

                    if (childId) {
                      commands.changeProperty(
                        childId,
                        'colSpan',
                        columns[index],
                      );
                    } else {
                      commands.addColumn(activeBlock.id, {
                        colSpan: columnSize,
                      });
                    }

                    const isLast = index === columns.length - 1;

                    if (isLast) {
                      const restChildren = activeBlock.children.slice(
                        index + 1,
                      );

                      if (restChildren.length === 0) return;

                      const childrenFromRemoved = restChildren
                        .map((child) => {
                          return state.getBlock(child).children.children;
                        })
                        .flat();

                      const futureLastChild = activeBlock.children.at(index);

                      if (!futureLastChild) return;

                      if (childrenFromRemoved.length > 0) {
                        commands.appendBlocks(
                          futureLastChild,
                          childrenFromRemoved,
                        );
                      }

                      commands.removeContent(activeBlock.id, restChildren);
                    }
                  });
                }
              });
            };

            const templates = [
              '12',
              '6+6',
              '4+4+4',
              '3+3+3+3',
              '4+8',
              '3+9',
              '3+6+3',
              '2+6+4',
              '2+10',
              '2+3+7',
            ];

            const customTemplateColumns = splitColumns(value).reduce(
              (a, b) => a + b,
              0,
            );

            const hasCustomTemplateError = customTemplateColumns > 12;

            return (
              <div>
                <p className="text-base">Template</p>

                <div className="flex flex-wrap">
                  {templates.map((template) => (
                    <TemplateButton
                      key={template}
                      template={template}
                      onClick={handleChangeTemplate}
                    />
                  ))}
                </div>

                <div className="py-4 text-center text-sm">
                  or, Custom Columns
                </div>

                <div className="flex items-start">
                  <div>
                    <div>
                      <Input
                        className="mb-2"
                        placeholder="Template: 4+4+4"
                        error={hasCustomTemplateError}
                        value={value}
                        onChange={(event) =>
                          setValue(event.currentTarget.value)
                        }
                      />

                      <Button
                        className="mx-4"
                        color="secondary"
                        onClick={() =>
                          handleChangeTemplate(splitColumns(value))
                        }
                      >
                        Generate
                      </Button>
                    </div>

                    {hasCustomTemplateError ? (
                      <div className="text-sm text-red-500">
                        The amount should not exceed 12, now{' '}
                        {customTemplateColumns}
                      </div>
                    ) : (
                      customTemplateColumns > 0 && (
                        <div className="text-sm">
                          {customTemplateColumns} columns out of 12
                        </div>
                      )
                    )}
                  </div>

                  {!hasCustomTemplateError && (
                    <TemplateButton
                      className="p-0"
                      template={value}
                      onClick={handleChangeTemplate}
                    />
                  )}
                </div>
              </div>
            );
          },
        }),
      }),
    ];
  },
});
