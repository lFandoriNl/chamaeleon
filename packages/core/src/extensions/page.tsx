import { BlockExtension } from '../block-extension';
import { Block } from '../model';
import { JSONContent } from '../types';

declare module '..' {
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
        return ({ commands }) => {
          commands.insertContent(target, {
            type: Page.name,
            props,
          });
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

        if (block.children.isEmpty) {
          return (
            <ui.ActionsTooltip
              placement="left"
              component={
                <ui.ActionAddBlockButton
                  onClick={(event) => {
                    editor.commands.intention(
                      block.id,
                      'add-block',
                      event.nativeEvent,
                    );
                  }}
                />
              }
            >
              <ui.PanelButton>Add root block for page</ui.PanelButton>
            </ui.ActionsTooltip>
          );
        }

        return (
          <>
            {children}

            <ui.ActionsTooltip
              placement="left"
              component={
                <ui.ActionAddBlockButton
                  onClick={(event) => {
                    editor.commands.intention(
                      block.id,
                      'add-block',
                      event.nativeEvent,
                    );
                  }}
                />
              }
            >
              <ui.AddExtraBlock className="mt-4" />
            </ui.ActionsTooltip>
          </>
        );
      },
      palette: () => {
        return <div>Page</div>;
      },
    };
  },
});
