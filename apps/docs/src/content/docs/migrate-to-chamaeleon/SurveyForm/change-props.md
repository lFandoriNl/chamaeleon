---
title: Change props
description: Creating a change props
sidebar:
  order: 7
---

In the previous section we added several props for our button, namely:

```ts
 props: {
  type: {
    default: 'button',
  },
  variant: {
    default: 'contained',
  },
  content: {
    default: 'Button',
  },
}
```

Let's now make it possible to edit the button text, for example

Chamaeleon has a special methods.addPropsView for adding components that can be rendered when we want to change some properties

Make a new `ChangeProps` plugin, in it we will add all our components that relate to editing the props of our blocks

```tsx
// builder/plugins/change-props.tsx
import { Plugin } from '@chamaeleon/core';
import TextField from '@mui/material/TextField';

export function ChangeProps(): Plugin {
  return {
    name: 'change-props',
    apply(editor, { addPropsView }) {
      addPropsView({
        // Using a filter, we determine whether this
        // component needs to be rendered for a specific block
        //
        // In this case, we want this component to be
        // rendered for all blocks that have a "content" prop
        filter(block) {
          return block.props.content !== undefined;
        },
        component: ({ block }) => {
          return (
            <TextField
              label="Content"
              value={block.props.content}
              onChange={(event) =>
                // using the "changeProperty" command we can
                // change any property of the block
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
    },
  };
}
```

Adding to editor

```diff lang="ts"
// demo.tsx
+import { ChangeProps } from './builder/plugins/change-props';

const editor = new Editor({
  plugins: [
    // ...
    Root(),
    Paper(),
    Stack(),
    Text(),
    TextField(),
    Button(),
+    ChangeProps(),
  ],
});
```

Well, we added our plugin to the editor, but nothing works yet, we need a place where we will render our components to change properties!

We will do this using another plugin in the next section
