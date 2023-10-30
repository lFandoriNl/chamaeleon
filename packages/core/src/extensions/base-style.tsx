import { Input } from '@chamaeleon/uikit';
import { Extension } from '../extension';
import { Plugin, PluginKey } from '../state';

export const BaseStyle = Extension.create({
  name: 'row',

  addPlugins() {
    return [
      new Plugin<any, 'style-configuration'>({
        key: new PluginKey('ChangeMargin'),
        type: 'style-configuration',
        cssProperty: {
          some: [
            'margin',
            'marginTop',
            'marginRight',
            'marginBottom',
            'marginLeft',
          ],
        },

        view: ({ view }) => ({
          render() {
            const { state } = view;
            const { activeBlock } = state;

            if (!activeBlock) return null;

            return <div>Margin</div>;
          },
        }),
      }),
      new Plugin<any, 'style-configuration'>({
        key: new PluginKey('Gap'),
        type: 'style-configuration',
        cssProperty: {
          some: ['gap', 'rowGap', 'columnGap'],
        },

        view: ({ editor, view }) => ({
          render(layer) {
            const { state } = view;

            const { activeBlock } = state;
            if (!activeBlock) return null;

            const style = activeBlock.style[layer];
            if (!style) return null;

            const { gap, rowGap, columnGap } = style;

            console.log(activeBlock, { gap, rowGap, columnGap });

            return (
              <div className="grid grid-cols-[auto_1fr] gap-4">
                {gap !== undefined && (
                  <>
                    <div className="flex items-center">
                      <p className="text-base">Gap:</p>
                    </div>

                    <Input
                      className="max-w-[150px]"
                      value={String(gap)}
                      onChange={(event) => {
                        editor.commands.changeStyle(activeBlock.id, layer, {
                          gap: event.currentTarget.value,
                          rowGap: event.currentTarget.value,
                          columnGap: event.currentTarget.value,
                        });
                      }}
                    />
                  </>
                )}

                {rowGap !== undefined && (
                  <>
                    <div className="flex items-center">
                      <p className="text-base">Row gap:</p>
                    </div>

                    <Input
                      className="max-w-[150px]"
                      value={String(rowGap)}
                      onChange={(event) => {
                        editor.commands.changeStyle(activeBlock.id, layer, {
                          rowGap: event.currentTarget.value,
                        });
                      }}
                    />
                  </>
                )}

                {columnGap !== undefined && (
                  <>
                    <div className="flex items-center">
                      <p className="text-base">Column gap:</p>
                    </div>

                    <Input
                      className="max-w-[150px]"
                      value={String(columnGap)}
                      onChange={(event) => {
                        editor.commands.changeStyle(activeBlock.id, layer, {
                          columnGap: event.currentTarget.value,
                        });
                      }}
                    />
                  </>
                )}
              </div>
            );
          },
        }),
      }),
    ];
  },
});
