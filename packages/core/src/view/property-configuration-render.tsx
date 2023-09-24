import { EditorView } from '.';

type PropertyConfigurationRender = {
  view: EditorView;
};

export const PropertyConfigurationRender = ({
  view,
}: PropertyConfigurationRender) => {
  return (
    <div
      className="property-configuration-place"
      ref={(ref) => {
        ref && view.setPropertyConfigurationElement(ref);
      }}
    >
      {Array.from(view.pluginViews)
        .filter(([_, { plugin, renderRules }]) => {
          return (
            plugin.is('property-configuration') &&
            renderRules.conditionals.map((cond) => cond()).every(Boolean)
          );
        })
        .map(([_, { updateParams, view }]) => {
          return view.update?.(...updateParams());
        })}
    </div>
  );
};
