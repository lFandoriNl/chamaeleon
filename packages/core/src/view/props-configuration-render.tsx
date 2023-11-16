import { EditorView } from './editor-view';

type PropsConfigurationRenderProps = {
  view: EditorView;
};

export const PropsConfigurationRender = ({
  view,
}: PropsConfigurationRenderProps) => {
  const { activeBlock } = view.state;

  if (!activeBlock) return null;

  return (
    <div className="property-configuration-place">
      {view.pluginPropsViews.map(
        ({ id, view: { filter, component: Component } }) => {
          if (!filter(activeBlock)) return null;

          return (
            <Component key={id} editor={view.editor} block={activeBlock} />
          );
        },
      )}
    </div>
  );
};
