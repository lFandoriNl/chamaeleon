---
title: Text block
description: Creating a text block
sidebar:
  order: 5
---

Now let's create a `Text` block `builder/plugins/text.tsx`

```tsx
// builder/plugins/text.tsx
import { Plugin } from '@chamaeleon/core';
import Typography from '@mui/material/Typography';

export function Text(): Plugin {
  return {
    name: 'text',
    apply(editor, { addBlock }) {
      addBlock({
        name: 'text',
        props: {
          // We declare that the text block has a
          // content prop and give it a default value
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
```

Adding to editor

```diff lang="ts"
// demo.tsx
+import { Text } from './builder/plugins/text';

const editor = new Editor({
  plugins: [
    // ...
    Root(),
    Paper(),
    Stack(),
+    Text(),
  ],
});
```
