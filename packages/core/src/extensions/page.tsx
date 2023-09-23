import { PanelButton } from '@chameleon/uikit';
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
      natural: ({ block, children }) => {
        return children;
      },
      editor: ({ block, children, editor }) => {
        if (block.children.isEmpty) {
          return (
            <editor.view.ui.BlockTooltip
              components={[
                {
                  placement: 'top-end',
                  component: (
                    <editor.view.ui.ActionSettingsButton
                      onClick={(event) => {
                        editor.commands.intention(
                          block.id,
                          'change-properties',
                          event.nativeEvent,
                        );
                      }}
                    />
                  ),
                },
                {
                  placement: 'left',
                  component: (
                    <editor.view.ui.ActionAddBlockButton
                      onClick={(event) => {
                        editor.commands.intention(
                          block.id,
                          'add-block',
                          event.nativeEvent,
                        );
                      }}
                    />
                  ),
                },
              ]}
            >
              <PanelButton>Add root block for page</PanelButton>
            </editor.view.ui.BlockTooltip>
          );
        }

        return children;
      },
      palette: () => {
        return <div>Page</div>;
      },
    };
  },
});
