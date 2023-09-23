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
    />
  );
};
