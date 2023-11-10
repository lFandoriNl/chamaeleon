import { FormControl, FormLabel, Input } from '@chamaeleon/uikit';

import { Plugin } from '../state';
import { capitalize } from '../utilities/capitalize';

export function Content(): Plugin {
  return {
    name: 'content-prop',
    apply(editor, { addPropsView }) {
      addPropsView({
        filter: (block) => {
          return block.props.content !== undefined;
        },
        component: ({ block }) => {
          return (
            <FormControl>
              <FormLabel>Content</FormLabel>

              <Input
                placeholder={`${capitalize(block.type.name)} content`}
                value={block.props.content}
                onChange={(event) => {
                  editor.commands.changeProperty(
                    block.id,
                    'content',
                    event.currentTarget.value,
                  );
                }}
              />
            </FormControl>
          );
        },
      });
    },
  };
}
