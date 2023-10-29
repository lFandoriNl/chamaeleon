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
    <div className="style-configuration-place">
      {Object.entries(activeBlock.type.style)
        .map(([element, cssProperties]) => {
          return pluginViews.map(([pluginKey, pluginView]) => {
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
                <Fragment key={element + pluginKey}>
                  {view.render?.(element, ...updateParams())}
                </Fragment>
              );
            }

            return null;
          });
        })
        .flat()}
    </div>
  );
};
