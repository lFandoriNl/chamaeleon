import { Plugin } from '@chamaeleon/core';
import Box from '@mui/material/Box';
import MuiStack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRef } from 'react';

import { AddNewBlock } from '../ui/add-new-block';
import { BlockToolbar } from '../ui/block-toolbar';
import { useHighlightStyles } from '../ui/use-highlight-styles';

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
            const { view } = editor;

            const ref = useRef<HTMLDivElement>(null);

            const styles = useHighlightStyles(block);

            return (
              <view.Draggable id={block.id}>
                <view.Dropzone>
                  <MuiStack
                    ref={ref}
                    spacing={block.props.spacing}
                    direction={block.props.direction}
                    sx={{ px: 2, ...styles }}
                  >
                    {children}

                    <Box display="flex" justifyContent="center">
                      <AddNewBlock id={block.id} />
                    </Box>
                  </MuiStack>
                </view.Dropzone>

                <view.ui.ActionPopover referenceRef={ref}>
                  <BlockToolbar id={block.id} />
                </view.ui.ActionPopover>
              </view.Draggable>
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
