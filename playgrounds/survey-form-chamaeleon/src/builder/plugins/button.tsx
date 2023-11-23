import { Plugin } from '@chamaeleon/core';
import MuiButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRef } from 'react';

import { BlockToolbar } from '../ui/block-toolbar';

export function Button(): Plugin {
  return {
    name: 'button',
    apply(editor, { addBlock }) {
      addBlock({
        name: 'button',
        props: {
          type: {
            default: 'button',
          },
          variant: {
            default: 'contained',
          },
          content: {
            default: 'Button',
          },
        },
        components: {
          view: ({ block }) => {
            const { type, variant, content } = block.props;

            return (
              <MuiButton type={type} variant={variant}>
                {content}
              </MuiButton>
            );
          },
          editor: ({ block }) => {
            const { type, variant, content } = block.props;

            const ref = useRef<HTMLButtonElement>(null);

            return (
              <>
                <MuiButton ref={ref} type={type} variant={variant}>
                  {content}
                </MuiButton>

                <editor.view.ui.ActionPopover referenceRef={ref}>
                  <BlockToolbar id={block.id} />
                </editor.view.ui.ActionPopover>
              </>
            );
          },
          palette: () => {
            return <Typography>Button</Typography>;
          },
        },
      });
    },
  };
}
