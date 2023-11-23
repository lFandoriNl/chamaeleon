---
title: Stack block
description: Creating a stack block
sidebar:
  order: 5
---

Now let's create a `Stack` block `builder/plugins/stack.tsx`

```tsx
// builder/plugins/stack.tsx
import { Plugin } from '@chamaeleon/core';
import Box from '@mui/material/Box';
import MuiStack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AddNewBlock } from '../ui/add-new-block';

export function Stack(): Plugin {
  return {
    name: 'stack',
    apply(editor, { addBlock }) {
      addBlock({
        name: 'stack',
        allowContent: {
          name: ['*', '!root'],
        },
        components: {
          view: ({ children }) => {
            return <MuiStack spacing={4}>{children}</MuiStack>;
          },
          editor: ({ block, children }) => {
            return (
              <MuiStack spacing={4}>
                {children}

                <Box display="flex" justifyContent="center">
                  <AddNewBlock id={block.id} />
                </Box>
              </MuiStack>
            );
          },
          palette: () => {
            return <Typography>Stack</Typography>;
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
+import { Paper } from './builder/plugins/paper';

const editor = new Editor({
  plugins: [
    // ...
    Root(),
    Paper(),
+    Stack(),
  ],
});
```
