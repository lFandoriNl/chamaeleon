import { Plugin } from '@chamaeleon/core';
import Box from '@mui/material/Box';
import MuiStack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRef } from 'react';

import { AddNewBlock } from '../ui/add-new-block';
import { BlockToolbar } from '../ui/block-toolbar';

export function Stack(): Plugin {
  return {
    name: 'stack',
    apply(editor, { addBlock }) {
      addBlock({
        name: 'stack',
        allowContent: {
          name: ['*', '!root'],
        },
        props: {
          spacing: {
            default: 4,
          },
          direction: {
            default: 'column',
          },
        },
        components: {
          view: ({ block, children }) => {
            return (
              <MuiStack
                spacing={block.props.spacing}
                direction={block.props.direction}
              >
                {children}
              </MuiStack>
            );
          },
          editor: ({ block, children }) => {
            const ref = useRef<HTMLDivElement>(null);

            return (
              <>
                <MuiStack
                  ref={ref}
                  spacing={block.props.spacing}
                  direction={block.props.direction}
                >
                  {children}

                  <Box display="flex" justifyContent="center">
                    <AddNewBlock id={block.id} />
                  </Box>
                </MuiStack>

                <editor.view.ui.ActionPopover referenceRef={ref}>
                  <BlockToolbar id={block.id} />
                </editor.view.ui.ActionPopover>
              </>
            );
          },
          palette: () => {
            return <Typography>Stack</Typography>;
          },
        },
      });
    },
  };
}
