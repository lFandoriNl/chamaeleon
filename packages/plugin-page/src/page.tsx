import { Block, JSONContent, Plugin } from '@chamaeleon/core';

declare module '@chamaeleon/core' {
  interface Commands<ReturnType> {
    page: {
      addPage: (
        target: Block['id'] | null,
        props?: JSONContent['props'],
      ) => ReturnType;
    };
  }
}

export function Page(): Plugin {
  const pageName = 'page';

  return {
    name: pageName,
    apply(editor, { addCommands, addBlock }) {
      addCommands({
        addPage: (target, props) => {
          return ({ commands }) => {
            if (target) {
              commands.insertContent(target, {
                type: pageName,
                props,
              });
            } else {
              commands.insertContent(editor.schema.spec.rootBlockId, {
                id: editor.schema.spec.rootBlockId,
                type: pageName,
                props,
              });
            }
          };
        },
      });

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
            const { ui } = editor.view;

            return (
              <>
                {block.children.isEmpty ? (
                  <div className="flex flex-col items-center justify-center p-5">
                    <p className="pb-4 text-xl">
                      {"It's empty here yet, add your first block"}
                    </p>

                    <ui.ActionAddBlockButton
                      onClick={(event) => {
                        editor.commands.intention(
                          block.id,
                          'add-block',
                          event.nativeEvent,
                        );
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <editor.view.Dropzone block={block}>
                      <div className="e-page">{children}</div>
                    </editor.view.Dropzone>

                    <div className="flex items-center justify-center p-8">
                      <ui.ActionAddBlockButton
                        onClick={(event) => {
                          editor.commands.intention(
                            block.id,
                            'add-block',
                            event.nativeEvent,
                          );
                        }}
                      />
                    </div>
                  </>
                )}
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
