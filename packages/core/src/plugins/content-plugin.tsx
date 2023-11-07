import { FormControl, FormLabel, Input } from '@chamaeleon/uikit';

import { Plugin, PluginKey } from '../state';
import { capitalize } from '../utilities/capitalize';

export const contentPlugin = new Plugin({
  key: new PluginKey('Content'),
  type: 'property-configuration',
  property: {
    name: 'content',
  },
  view: ({ view, editor }) => ({
    render() {
      const { state } = view;

      const { activeBlock } = state;

      if (!activeBlock) return null;

      return (
        <FormControl>
          <FormLabel>Content</FormLabel>

          <Input
            placeholder={`${capitalize(activeBlock.type.name)} content`}
            value={activeBlock.props.content}
            onChange={(event) => {
              editor.commands.changeProperty(
                activeBlock.id,
                'content',
                event.currentTarget.value,
              );
            }}
          />
        </FormControl>
      );
    },
  }),
});
