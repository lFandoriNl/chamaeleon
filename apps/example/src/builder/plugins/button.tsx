import { Plugin } from '@chamaeleon/core';
import MuiButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRef } from 'react';

import { BlockToolbar } from '../ui/block-toolbar';
import { useHighlightStyles } from '../ui/use-highlight-styles';

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
            const { view } = editor;

            const { type, variant, content } = block.props;

            const ref = useRef<HTMLButtonElement>(null);

            const styles = useHighlightStyles(block);

            return (
              <view.Draggable id={block.id}>
                <MuiButton ref={ref} type={type} variant={variant} sx={styles}>
                  {content}
                </MuiButton>

                <view.ui.ActionPopover referenceRef={ref}>
                  <BlockToolbar id={block.id} />
                </view.ui.ActionPopover>
              </view.Draggable>
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
