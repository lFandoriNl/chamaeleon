import { Plugin } from '@chamaeleon/core';
import MuiTextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { BlockToolbar } from '../ui/block-toolbar';

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
                    value={field.value || ''}
                  />
                )}
              />
            );
          },
          editor: ({ block }) => {
            const ref = useRef<HTMLDivElement>(null);

            const { control } = useFormContext();

            return (
              <>
                <Controller
                  name={block.props.fieldName}
                  control={control}
                  shouldUnregister
                  render={({ field }) => (
                    <MuiTextField
                      inputRef={ref}
                      label={block.props.label}
                      variant="outlined"
                      {...field}
                      value={field.value || ''}
                    />
                  )}
                />

                <editor.view.ui.ActionPopover referenceRef={ref}>
                  <BlockToolbar id={block.id} />
                </editor.view.ui.ActionPopover>
              </>
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
