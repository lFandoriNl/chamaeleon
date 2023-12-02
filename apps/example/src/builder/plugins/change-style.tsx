import { Plugin } from '@chamaeleon/core';
import TextField from '@mui/material/TextField';

export function ChangeStyle(): Plugin {
  return {
    name: 'change-style',
    apply(editor, { addStyleView }) {
      addStyleView({
        filter(styleSpec) {
          return 'padding' in styleSpec;
        },
        component: ({ block, style, layer }) => {
          return (
            <TextField
              label="Padding"
              value={style.padding}
              onChange={(event) => {
                const parsed = parseFloat(event.target.value);

                const isNumber =
                  String(parsed).length === event.target.value.length;

                editor.commands.changeStyle(block.id, layer, {
                  padding: isNumber ? parsed : event.target.value,
                });
              }}
            />
          );
        },
      });
    },
  };
}
