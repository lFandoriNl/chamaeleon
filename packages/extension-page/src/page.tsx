import { BlockExtension, Block, JSONContent } from '@chamaeleon/core';

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

export const Page = BlockExtension.create({
  name: 'page',

  allowContent: {
    rootable: true,
  },

  addProperties() {
    return {
      title: {
        default: 'Enter your page title',
      },
    };
  },

  addCommands() {
    return {
      addPage: (target, props) => {
        return ({ commands, editor }) => {
          if (target) {
            commands.insertContent(target, {
              type: Page.name,
              props,
            });
          } else {
            commands.insertContent(editor.schema.spec.rootBlockId, {
              id: editor.schema.spec.rootBlockId,
              type: Page.name,
              props,
            });
          }
        };
      },
    };
  },

  addBlockViews() {
    return {
      natural: ({ children }) => {
        return children;
      },
      editor: ({ block, children, editor }) => {
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
    };
  },
});
