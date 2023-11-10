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

  return (
    <div className="style-configuration-place space-y-4">
      {Object.entries(activeBlock.type.style)
        .map(([layer, cssProperties]) => {
          return (
            <Fragment key={layer}>
              <p className="border-b pb-2 text-lg text-gray-500">{layer}</p>

              {view.pluginStyleViews.map(
                ({ name, params: { filter, component: Component } }) => {
                  const { activeBlock } = view.state;

                  if (!activeBlock) return null;

                  if (!filter(cssProperties, activeBlock, layer)) return null;

                  return (
                    <Component
                      key={layer + name}
                      editor={view.editor}
                      layer={layer}
                      styleSpec={cssProperties}
                      style={activeBlock.style[layer] || {}}
                      block={activeBlock}
                    />
                  );
                },
              )}
            </Fragment>
          );
        })
        .flat()}
    </div>
  );
};
