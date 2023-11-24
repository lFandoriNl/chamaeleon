import { Plugin } from '@chamaeleon/core';
import Box from '@mui/material/Box';
import MuiPaper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useRef } from 'react';

import { AddNewBlock } from '../ui/add-new-block';
import { BlockToolbar } from '../ui/block-toolbar';
import { useHighlightStyles } from '../ui/use-highlight-styles';

export function Paper(): Plugin {
  return {
    name: 'paper',
    apply(editor, { addBlock }) {
      addBlock({
        name: 'paper',
        allowContent: {
          name: ['*', '!root', '!paper'],
        },
        style: {
          root: {
            padding: 4,
          },
        },
        components: {
          view: ({ block, children }) => {
            return <MuiPaper sx={{ ...block.style.root }}>{children}</MuiPaper>;
          },
          editor: ({ block, children }) => {
            const { view } = editor;

            const ref = useRef<HTMLDivElement>(null);

            const styles = useHighlightStyles(block);

            return (
              <view.Draggable id={block.id}>
                <view.Dropzone>
                  <MuiPaper
                    ref={ref}
                    sx={{
                      ...block.style.root,
                      ...styles,
                    }}
                  >
                    {children}

                    <Box display="flex" justifyContent="center">
                      <AddNewBlock id={block.id} />
                    </Box>
                  </MuiPaper>
                </view.Dropzone>

                <view.ui.ActionPopover referenceRef={ref}>
                  <BlockToolbar id={block.id} />
                </view.ui.ActionPopover>
              </view.Draggable>
            );
          },
          palette: () => {
            return <Typography>Paper</Typography>;
          },
        },
      });
    },
  };
}
