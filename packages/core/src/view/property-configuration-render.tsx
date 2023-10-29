import { Fragment } from 'react';
import { EditorView } from '.';

type PropertyConfigurationRender = {
  view: EditorView;
};

export const PropertyConfigurationRender = ({
  view,
}: PropertyConfigurationRender) => {
  return (
    <div className="property-configuration-place">
      {Array.from(view.pluginViews).map(([_, pluginView]) => {
        if (pluginView.type !== 'property-configuration') return null;

        const { renderRules, view, updateParams } = pluginView;

        const canRender = renderRules.conditionals
          .map((cond) => cond())
          .every(Boolean);

        if (!canRender) return null;

        return (
          <Fragment key={pluginView.plugin.key}>
            {view.render?.(...updateParams())}
          </Fragment>
        );
      })}
    </div>
  );
};
