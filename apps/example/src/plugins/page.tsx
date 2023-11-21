import { Flex, Text } from '@mantine/core';

import { Plugin } from '@chamaeleon/core';

import { AddBlockButton } from '../shared/builder-ui/add-block-button';

export function Page(): Plugin {
  const pageName = 'page';

  return {
    name: pageName,
    apply(editor, { addBlock }) {
      addBlock({
        name: 'page',
        allowContent: {
          rootable: true,
        },
        props: {
          title: {
            default: 'Enter your page title',
          },
        },
        components: {
          view: ({ children }) => {
            return children;
          },
          editor: ({ block, children }) => {
            if (block.children.isEmpty) {
              return (
                <Flex direction="column" align="center" justify="center" p="xl">
                  <Text size="xl" pb="xl">
                    {"It's empty here yet, add your first block"}
                  </Text>

                  <AddBlockButton
                    onClick={(event) => {
                      editor.commands.intention(
                        block.id,
                        'add-block',
                        event.currentTarget,
                      );
                    }}
                  />
                </Flex>
              );
            }

            return (
              <>
                <editor.view.Dropzone block={block}>
                  <div className="e-page">{children}</div>
                </editor.view.Dropzone>

                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  mt="xl"
                >
                  <AddBlockButton
                    onClick={(event) => {
                      editor.commands.intention(
                        block.id,
                        'add-block',
                        event.currentTarget,
                      );
                    }}
                  />
                </Flex>
              </>
            );
          },
          palette: () => {
            return <div>Page</div>;
          },
        },
      });
    },
  };
}
