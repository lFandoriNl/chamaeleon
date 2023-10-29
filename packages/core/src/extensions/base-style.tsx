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

        view: (view) => ({
          render() {
            const { state } = view;
            const { activeBlock } = state;

            if (!activeBlock) return null;

            return <div>Margin</div>;
          },
        }),
      }),
    ];
  },
});
