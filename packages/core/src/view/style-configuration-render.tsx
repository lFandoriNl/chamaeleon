import { Fragment } from 'react';

import { EditorView } from '.';

type StyleConfigurationRenderProps = {
  view: EditorView;
};

export const StyleConfigurationRender = ({
  view,
}: StyleConfigurationRenderProps) => {
  const { activeBlock } = view.state;

  if (!activeBlock) return null;

  const pluginViews = Array.from(view.pluginViews).filter(
    ([_, { plugin, renderRules }]) => {
      return (
        plugin.spec.type === 'style-configuration' &&
        renderRules.conditionals.map((cond) => cond()).every(Boolean)
      );
    },
  );

  return (
    <div className="style-configuration-place space-y-4">
      {Object.entries(activeBlock.type.style)
        .map(([layer, cssProperties]) => {
          return (
            <Fragment key={layer}>
              <p className="border-b pb-2 text-lg text-gray-500">{layer}</p>

              {pluginViews.map(([pluginKey, pluginView]) => {
                if (pluginView.type !== 'style-configuration') return null;

                const { plugin, updateParams, view } = pluginView;

                const { cssProperty } = plugin.spec;

                if (
                  (cssProperty.some &&
                    cssProperty.some.some((name) => cssProperties[name])) ||
                  (cssProperty.every &&
                    cssProperty.every.every((name) => cssProperties[name]))
                ) {
                  return (
                    <Fragment key={layer + pluginKey}>
                      {view.render?.(layer, ...updateParams())}
                    </Fragment>
                  );
                }

                return null;
              })}
            </Fragment>
          );
        })
        .flat()}
    </div>
  );
};
