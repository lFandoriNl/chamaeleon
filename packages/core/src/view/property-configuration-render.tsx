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
      {Array.from(view.pluginViews).map(([_, pluginView]) => {
        if (pluginView.type !== 'property-configuration') return null;

        const { renderRules, view, updateParams } = pluginView;

        const canRender = renderRules.conditionals
          .map((cond) => cond())
          .every(Boolean);

        if (!canRender) return null;

        return view.update?.(...updateParams());
      })}
    </div>
  );
};
