import { useRef } from 'react';

import { Plugin } from '@chamaeleon/core';
import { Button as UIButton } from '@chamaeleon/uikit';

export function Button(): Plugin {
  return {
    name: 'button',
    apply(editor, { addBlock }) {
      addBlock({
        name: 'button',
        allowContent: {},
        withValue: true,
        props: {
          content: {
            default: 'Button',
          },
        },
        style: {
          root: {
            margin: 10,
            // margin: '5px 10px 15px 20px',
            // marginTop: 0,
            // marginRight: undefined,
            // marginBottom: undefined,
            // marginLeft: undefined,
          },
        },
        components: {
          view: ({ block }) => {
            return (
              <UIButton style={block.style.root}>{block.props.value}</UIButton>
            );
          },
          editor: ({ block }) => {
            const { ui } = editor.view;

            const referenceRef = useRef<HTMLButtonElement>(null);

            return (
              <>
                <editor.view.Block id={block.id} ref={referenceRef}>
                  <UIButton style={block.style.root}>
                    {block.props.content}
                  </UIButton>

                  <ui.ActionPopover
                    referenceRef={referenceRef}
                    placement="top-start"
                  >
                    <ui.DragButton />
                  </ui.ActionPopover>

                  <ui.ActionPopover
                    referenceRef={referenceRef}
                    placement="top-end"
                  >
                    <ui.ActionSettingsButton
                      onClick={(event) => {
                        editor.commands.intention(
                          block.id,
                          'change-properties',
                          event.nativeEvent,
                        );
                      }}
                    />
                  </ui.ActionPopover>
                </editor.view.Block>
              </>
            );
          },
          palette: () => {
            return <div>Button</div>;
          },
        },
      });
    },
  };
}
