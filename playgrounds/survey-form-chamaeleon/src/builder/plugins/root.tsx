import { Plugin } from '@chamaeleon/core';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { AddNewBlock } from '../ui/add-new-block';

export function Root(): Plugin {
  return {
    name: 'root',
    apply(editor, methods) {
      methods.addBlock({
        name: 'root',
        allowContent: {
          name: ['*', '!root'],
        },
        components: {
          view: ({ children }) => {
            return children;
          },
          editor: ({ block, children }) => {
            return (
              <>
                {children}

                <Box display="flex" justifyContent="center">
                  <AddNewBlock id={block.id} />
                </Box>
              </>
            );
          },
          palette: () => {
            return <Typography>Root</Typography>;
          },
        },
      });
    },
  };
}
