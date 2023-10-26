import { BlockExtension } from '@chamaeleon/core';
import { useRef } from 'react';

export const Button = BlockExtension.create({
  name: 'button',

  allowContent: {},

  withValue: true,

  addProperties() {
    return {
      value: {
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
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            style={block.style.root}
          >
            {block.props.value}
          </button>
        );
      },
      editor: ({ block, editor }) => {
        const { ui } = editor.view;

        const referenceRef = useRef<HTMLButtonElement>(null);

        return (
          <>
            <button
              ref={referenceRef}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              style={block.style.root}
            >
              {block.props.value}
            </button>

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
          </>
        );
      },
      palette: () => {
        return <div>Button</div>;
      },
    };
  },
});
