import { Plugin } from '@chamaeleon/core';
import Box from '@mui/material/Box';
import MuiPaper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useRef } from 'react';

import { AddNewBlock } from '../ui/add-new-block';
import { BlockToolbar } from '../ui/block-toolbar';

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
            const ref = useRef<HTMLDivElement>(null);

            return (
              <>
                <MuiPaper ref={ref} sx={{ ...block.style.root }}>
                  {children}

                  <Box display="flex" justifyContent="center">
                    <AddNewBlock id={block.id} />
                  </Box>
                </MuiPaper>

                <editor.view.ui.ActionPopover referenceRef={ref}>
                  <BlockToolbar id={block.id} />
                </editor.view.ui.ActionPopover>
              </>
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
