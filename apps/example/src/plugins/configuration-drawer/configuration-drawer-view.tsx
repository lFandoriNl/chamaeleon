import { EditorView, Editor } from '@chamaeleon/core';
import { CloseButton, Flex, Text } from '@mantine/core';
import { Fragment } from 'react';

import { Drawer } from './drawer';

const capitalize = (str: string) => {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};

type BlockConfigurationProps = {
  view: EditorView;
  extra?: React.ReactNode;
};

const BlockConfiguration = ({ view, extra }: BlockConfigurationProps) => {
  const { activeBlock } = view.state;

  if (!activeBlock) return null;

  return (
    <div className="h-full">
      <Flex
        className="border-b border-gray-300"
        p={4}
        align="center"
        justify="space-between"
      >
        <Text size="xl">{capitalize(activeBlock.type.name)} properties</Text>

        {extra}
      </Flex>

      <div className="h-full overflow-y-auto p-4">
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

        <p className="pb-2 pt-4 text-center text-lg">Style</p>

        <div className="style-configuration-place space-y-4">
          {Object.entries(activeBlock.type.style)
            .map(([layer, cssProperties]) => {
              return (
                <Fragment key={layer}>
                  <p className="border-b pb-2 text-lg text-gray-500">{layer}</p>

                  {view.pluginStyleViews.map(
                    ({ id, view: { filter, component: Component } }) => {
                      const { activeBlock } = view.state;

                      if (!activeBlock) return null;

                      if (!filter(cssProperties, activeBlock, layer))
                        return null;

                      return (
                        <Component
                          key={id}
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
      </div>
    </div>
  );
};

type ConfigurationDrawerViewProps = {
  open: boolean;
  editor: Editor;
};

export const ConfigurationDrawerView = ({
  open,
  editor,
}: ConfigurationDrawerViewProps) => {
  return (
    <Drawer open={open} onClose={editor.commands.closeConfiguration}>
      <BlockConfiguration
        view={editor.view}
        extra={
          <CloseButton size="lg" onClick={editor.commands.closeConfiguration} />
        }
      />
    </Drawer>
  );
};
