---
title: Button block
description: Creating a button block
sidebar:
  order: 6
---

Now let's create a `Button` block `builder/plugins/button.tsx`

```tsx
// builder/plugins/button.tsx
import { Plugin } from '@chamaeleon/core';
import MuiButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export function Button(): Plugin {
  return {
    name: 'button',
    apply(editor, { addBlock }) {
      addBlock({
        name: 'button',
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
        },
        components: {
          view: ({ block }) => {
            const { type, variant, content } = block.props;

            return (
              <MuiButton type={type} variant={variant}>
                {content}
              </MuiButton>
            );
          },
          editor: ({ block }) => {
            const { type, variant, content } = block.props;

            return (
              <MuiButton type={type} variant={variant}>
                {content}
              </MuiButton>
            );
          },
          palette: () => {
            return <Typography>Button</Typography>;
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
+import { Button } from './builder/plugins/button';

const editor = new Editor({
  plugins: [
    // ...
    Root(),
    Paper(),
    Stack(),
    Text(),
    TextField(),
+    Button(),
  ],
});
```
