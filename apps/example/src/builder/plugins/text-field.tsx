import { Plugin } from '@chamaeleon/core';
import MuiTextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { BlockToolbar } from '../ui/block-toolbar';
import { useHighlightStyles } from '../ui/use-highlight-styles';

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
            const { view } = editor;

            const referenceRef = useRef<HTMLDivElement>(null);

            const { control } = useFormContext();

            const styles = useHighlightStyles(block);

            return (
              <view.Draggable id={block.id} ref={referenceRef}>
                {({ ref, attrs, listeners, style }) => (
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
                          {...attrs}
                          {...listeners}
                          sx={{ ...styles, ...style }}
                        />
                      )}
                    />

                    <view.ui.ActionPopover referenceRef={referenceRef}>
                      <BlockToolbar id={block.id} />
                    </view.ui.ActionPopover>
                  </>
                )}
              </view.Draggable>
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
