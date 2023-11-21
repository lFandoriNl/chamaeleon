import { useRef } from 'react';

import { Button as UIButton } from '@mantine/core';
import { Plugin } from '@chamaeleon/core';

import { DragButton } from '../shared/builder-ui/drag-button';
import { SettingButton } from '../shared/builder-ui/settings-button';

export function Button(): Plugin {
  return {
    name: 'button',
    apply(editor, { addBlock }) {
      addBlock({
        name: 'button',
        props: {
          content: {
            default: 'Button',
          },
        },
        style: {
          root: {
            margin: undefined,
            padding: undefined,
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
                  <UIButton color="blue" style={block.style.root}>
                    {block.props.content}
                  </UIButton>

                  <ui.ActionPopover
                    referenceRef={referenceRef}
                    placement="top-start"
                  >
                    <DragButton />
                  </ui.ActionPopover>

                  <ui.ActionPopover
                    referenceRef={referenceRef}
                    placement="top-end"
                  >
                    <SettingButton
                      onClick={(event) => {
                        editor.commands.intention(
                          block.id,
                          'change-properties',
                          event.currentTarget,
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
