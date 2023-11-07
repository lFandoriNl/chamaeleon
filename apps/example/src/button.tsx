import { BlockExtension } from '@chamaeleon/core';
import { Button as UIButton } from '@chamaeleon/uikit';
import { useRef } from 'react';

export const Button = BlockExtension.create({
  name: 'button',

  allowContent: {},

  withValue: true,

  addProperties() {
    return {
      content: {
        default: 'Button',
      },
    };
  },

  addStyle() {
    return {
      root: {
        margin: {
          default: 0,
        },
      },
    };
  },

  addBlockViews() {
    return {
      natural: ({ block }) => {
        return (
          <UIButton style={block.style.root}>{block.props.value}</UIButton>
        );
      },
      editor: ({ block, editor }) => {
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

              <ui.ActionPopover referenceRef={referenceRef} placement="top-end">
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
    };
  },
});
