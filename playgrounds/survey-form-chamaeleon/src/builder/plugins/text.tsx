import { Plugin } from '@chamaeleon/core';
import Typography from '@mui/material/Typography';

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
        components: {
          view: ({ block }) => {
            return (
              <Typography sx={{ pb: 2 }}>{block.props.content}</Typography>
            );
          },
          editor: ({ block }) => {
            return (
              <Typography sx={{ pb: 2 }}>{block.props.content}</Typography>
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
