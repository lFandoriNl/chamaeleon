import { Plugin } from '@chamaeleon/core';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

export function ChangeProps(): Plugin {
  return {
    name: 'change-props',
    apply(editor, { addPropsView }) {
      addPropsView({
        filter(block) {
          return block.props.content !== undefined;
        },
        component: ({ block }) => {
          return (
            <TextField
              label="Content"
              value={block.props.content}
              onChange={(event) =>
                editor.commands.changeProperty(
                  block.id,
                  'content',
                  event.target.value || 'Empty',
                )
              }
            />
          );
        },
      });

      addPropsView({
        filter(block) {
          return block.props.spacing !== undefined;
        },
        component: ({ block }) => {
          return (
            <TextField
              label="Spacing"
              value={block.props.spacing}
              onChange={(event) => {
                const parsed = parseFloat(event.target.value);

                const isNumber =
                  String(parsed).length === event.target.value.length;

                editor.commands.changeProperty(
                  block.id,
                  'spacing',
                  isNumber ? parsed : event.target.value,
                );
              }}
            />
          );
        },
      });

      addPropsView({
        filter(block) {
          return block.props.direction !== undefined;
        },
        component: ({ block }) => {
          return (
            <TextField
              select
              label="Direction"
              value={block.props.direction}
              onChange={(event) => {
                editor.commands.changeProperty(
                  block.id,
                  'direction',
                  event.target.value,
                );
              }}
            >
              {['row', 'row-reverse', 'column', 'column-reverse'].map(
                (option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ),
              )}
            </TextField>
          );
        },
      });
    },
  };
}
