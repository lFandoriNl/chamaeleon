import { Input } from '@chamaeleon/uikit';

import { Plugin } from '../state';

export function Gap(): Plugin {
  return {
    name: 'gap-style',

    apply(editor, { addStyleView }) {
      addStyleView({
        filter: (styleSpec) => {
          return ['gap', 'rowGap', 'columnGap'].some((property) => {
            return property in styleSpec;
          });
        },
        component: ({ layer, style, styleSpec, block }) => {
          const { gap, rowGap, columnGap } = style;

          return (
            <div className="grid grid-cols-[auto_1fr] gap-4">
              {'gap' in styleSpec && (
                <>
                  <div className="flex items-center">
                    <p className="text-base">Gap:</p>
                  </div>

                  <Input
                    className="max-w-[150px]"
                    value={String(gap || '')}
                    onChange={(event) => {
                      editor.commands.changeStyle(block.id, layer, {
                        gap: event.currentTarget.value,
                        rowGap: event.currentTarget.value,
                        columnGap: event.currentTarget.value,
                      });
                    }}
                  />
                </>
              )}

              {'rowGap' in styleSpec && (
                <>
                  <div className="flex items-center">
                    <p className="text-base">Row gap:</p>
                  </div>

                  <Input
                    className="max-w-[150px]"
                    value={String(rowGap || '')}
                    onChange={(event) => {
                      editor.commands.changeStyle(block.id, layer, {
                        rowGap: event.currentTarget.value,
                      });
                    }}
                  />
                </>
              )}

              {'columnGap' in styleSpec && (
                <>
                  <div className="flex items-center">
                    <p className="text-base">Column gap:</p>
                  </div>

                  <Input
                    className="max-w-[150px]"
                    value={String(columnGap || '')}
                    onChange={(event) => {
                      editor.commands.changeStyle(block.id, layer, {
                        columnGap: event.currentTarget.value,
                      });
                    }}
                  />
                </>
              )}
            </div>
          );
        },
      });
    },
  };
}
