import { Plugin } from '@chamaeleon/core';
import MuiTextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller, useFormContext } from 'react-hook-form';

export function TextField(): Plugin {
  return {
    name: 'text-field',
    apply(editor, { addBlock }) {
      addBlock({
        name: 'text-field',
        props: {
          label: {
            default: 'Label',
          },
          fieldName: {
            default: '',
          },
        },
        components: {
          view: ({ block }) => {
            const { control } = useFormContext();

            return (
              <Controller
                name={block.props.fieldName}
                control={control}
                render={({ field }) => (
                  <MuiTextField
                    label={block.props.label}
                    variant="outlined"
                    {...field}
                  />
                )}
              />
            );
          },
          editor: ({ block }) => {
            const { control } = useFormContext();

            return (
              <Controller
                name={block.props.fieldName}
                control={control}
                render={({ field }) => (
                  <MuiTextField
                    label={block.props.label}
                    variant="outlined"
                    {...field}
                  />
                )}
              />
            );
          },
          palette: () => {
            return <Typography>TextField</Typography>;
          },
        },
      });
    },
  };
}
