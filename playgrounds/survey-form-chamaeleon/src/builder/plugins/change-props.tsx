import { Plugin } from '@chamaeleon/core';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

export function ChangeProps(): Plugin {
  return {
    name: 'change-props',
    apply(editor, { addPropsView }) {
      [
        { label: 'Content', propName: 'content', valueIfEmpty: 'Empty' },
        { label: 'Label', propName: 'label' },
        { label: 'FieldName', propName: 'fieldName' },
      ].forEach(({ label, propName, valueIfEmpty }) => {
        addPropsView({
          filter(block) {
            return block.props[propName] !== undefined;
          },
          component: ({ block }) => {
            return (
              <TextField
                label={label}
                value={block.props[propName]}
                onChange={(event) =>
                  editor.commands.changeProperty(
                    block.id,
                    propName,
                    event.target.value || valueIfEmpty || '',
                  )
                }
              />
            );
          },
        });
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

      [
        {
          label: 'Direction',
          propName: 'direction',
          items: ['row', 'row-reverse', 'column', 'column-reverse'],
        },
        {
          label: 'Type',
          propName: 'type',
          items: ['button', 'submit', 'reset'],
        },
        {
          label: 'Variant',
          propName: 'variant',
          items: ['contained', 'outlined', 'text'],
        },
      ].forEach(({ label, propName, items }) => {
        addPropsView({
          filter(block) {
            return block.props[propName] !== undefined;
          },
          component: ({ block }) => {
            return (
              <TextField
                select
                label={label}
                value={block.props[propName]}
                onChange={(event) => {
                  editor.commands.changeProperty(
                    block.id,
                    propName,
                    event.target.value,
                  );
                }}
              >
                {items.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            );
          },
        });
      });
    },
  };
}
