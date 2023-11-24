import { Plugin } from '@chamaeleon/core';
import Typography from '@mui/material/Typography';
import { useRef } from 'react';

import { BlockToolbar } from '../ui/block-toolbar';
import { useHighlightStyles } from '../ui/use-highlight-styles';

export function Text(): Plugin {
  return {
    name: 'text',
    apply(editor, { addBlock }) {
      addBlock({
        name: 'text',
        props: {
          content: {
            default: 'Enter your text',
          },
        },
        style: {
          root: {
            padding: '0 0 16px 0',
          },
        },
        components: {
          view: ({ block }) => {
            return (
              <Typography sx={{ ...block.style.root }}>
                {block.props.content}
              </Typography>
            );
          },
          editor: ({ block, editor }) => {
            const { view } = editor;

            const ref = useRef<HTMLParagraphElement>(null);

            const styles = useHighlightStyles(block);

            return (
              <view.Draggable id={block.id}>
                <Typography ref={ref} sx={{ ...block.style.root, ...styles }}>
                  {block.props.content}
                </Typography>

                <view.ui.ActionPopover referenceRef={ref}>
                  <BlockToolbar id={block.id} />
                </view.ui.ActionPopover>
              </view.Draggable>
            );
          },
          palette: () => {
            return <Typography>Text</Typography>;
          },
        },
      });
    },
  };
}
