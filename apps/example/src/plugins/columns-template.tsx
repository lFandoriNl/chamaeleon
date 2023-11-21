import { useState } from 'react';
import clsx from 'clsx';

import { Plugin } from '@chamaeleon/core';
import { Button, TextInput } from '@mantine/core';

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
      className={clsx(
        'group flex w-1/5 cursor-pointer flex-col items-center border-none bg-transparent p-2',
        className,
      )}
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

export function ColumnsTemplate(): Plugin {
  return {
    name: 'row-columns-prop',

    apply(editor, { addPropsView }) {
      addPropsView({
        name: 'row-columns',
        filter: (block) => block.type.name === 'row',

        component: ({ block }) => {
          const { state } = editor;

          const [value, setValue] = useState('');

          const handleChangeTemplate = (columns: number[]) => {
            editor.commands.command(({ commands }) => {
              if (block.children.isEmpty) {
                columns.forEach((columnSize) => {
                  commands.addColumn(block.id, {
                    colSpan: columnSize,
                  });
                });
              } else {
                columns.forEach((columnSize, index) => {
                  const childId = block.children.at(index);

                  if (childId) {
                    commands.changeProperty(childId, 'colSpan', columns[index]);
                  } else {
                    commands.addColumn(block.id, {
                      colSpan: columnSize,
                    });
                  }

                  const isLast = index === columns.length - 1;

                  if (isLast) {
                    const restChildren = block.children.slice(index + 1);

                    if (restChildren.length === 0) return;

                    const childrenFromRemoved = restChildren
                      .map((child) => {
                        return state.getBlock(child).children.children;
                      })
                      .flat();

                    const futureLastChild = block.children.at(index);

                    if (!futureLastChild) return;

                    if (childrenFromRemoved.length > 0) {
                      commands.appendBlocks(
                        futureLastChild,
                        childrenFromRemoved,
                      );
                    }

                    commands.removeContent(block.id, restChildren);
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

              <div className="py-4 text-center text-sm">or, Custom Columns</div>

              <div className="flex items-start">
                <div className="flex flex-row">
                  <TextInput
                    mb={2}
                    w={182}
                    placeholder="Template: 4+4+4"
                    description={
                      !hasCustomTemplateError &&
                      customTemplateColumns > 0 && (
                        <div className="text-sm">
                          {customTemplateColumns} columns out of 12
                        </div>
                      )
                    }
                    error={
                      hasCustomTemplateError && (
                        <div className="text-sm text-red-500">
                          The amount should not exceed 12, now{' '}
                          {customTemplateColumns}
                        </div>
                      )
                    }
                    inputWrapperOrder={['input', 'error', 'description']}
                    onChange={(event) => setValue(event.target.value)}
                  />

                  <Button
                    className="mx-4"
                    color="blue"
                    onClick={() => handleChangeTemplate(splitColumns(value))}
                  >
                    Generate
                  </Button>
                </div>

                {!hasCustomTemplateError && (
                  <TemplateButton
                    className="!p-0"
                    template={value}
                    onClick={handleChangeTemplate}
                  />
                )}
              </div>
            </div>
          );
        },
      });
    },
  };
}
