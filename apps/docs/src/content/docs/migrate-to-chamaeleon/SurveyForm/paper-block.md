---
title: Paper block
description: Creating a paper block
sidebar:
  order: 4
---

Let's create our first `Paper` building block `builder/plugins/paper.tsx`

```tsx
// builder/plugins/paper.tsx
import { Plugin } from '@chamaeleon/core';
import MuiPaper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export function Paper(): Plugin {
  return {
    name: 'paper',
    apply(editor, { addBlock }) {
      addBlock({
        name: 'paper',
        allowContent: {
          name: ['*', '!root', '!paper'],
        },
        components: {
          view: ({ children }) => {
            return <MuiPaper sx={{ p: 4 }}>{children}</MuiPaper>;
          },
          editor: ({ children }) => {
            return <MuiPaper sx={{ p: 4 }}>{children}</MuiPaper>;
          },
          palette: () => {
            return <Typography>Paper</Typography>;
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
+    Paper(),
  ],
});
```

Now let's make a component for the button, when clicked, a list of available blocks for adding will be shown

```tsx
// builder/ui/add-new-block.tsx
import { Block } from '@chamaeleon/core';
import { useEditor } from '@chamaeleon/react-editor';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useId, useState } from 'react';

type AddNewBlockProps = {
  id: Block['id'];
};

export function AddNewBlock({ id }: AddNewBlockProps) {
  const editor = useEditor();

  const a11yId = useId();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (name?: Block['type']['name']) => {
    setAnchorEl(null);

    if (name) {
      editor.commands.insertContent(id, {
        type: name,
      });
    }
  };

  const allowedBlocksItems = editor.state.schema
    .getAllowContent(editor.state.getBlock(id))
    .map((blockType) => {
      const Component = editor.view.getBlockViews(blockType.name)['palette'];

      return {
        name: blockType.name,
        component: <Component />,
      };
    });

  if (allowedBlocksItems.length === 0) {
    return null;
  }

  return (
    <>
      <IconButton
        id={a11yId}
        color="primary"
        aria-label="add new block"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <AddCircleIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        MenuListProps={{
          'aria-labelledby': a11yId,
          sx: {
            minWidth: 180,
          },
        }}
      >
        {allowedBlocksItems.map(({ name, component }) => (
          <MenuItem key={name} onClick={() => handleClose(name)}>
            {component}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
```

Now let’s add a button to add a block to the `root` and `paper` blocks, also note that for the `paper` block there are no blocks available to add yet, so the button will not be shown

```diff lang="tsx"
// builder/plugins/root.tsx
editor: ({ block, children }) => {
  return (
    <>
      {children}

+      <Box display="flex" justifyContent="center">
+        <AddNewBlock id={block.id} />
+      </Box>
    </>
  );
},
```

```diff lang="tsx"
// builder/plugins/paper.tsx
editor: ({ block, children }) => {
  return (
    <MuiPaper sx={{ p: 4 }}>
      {children}

+      <Box display="flex" justifyContent="center">
+        <AddNewBlock id={block.id} />
+      </Box>
    </MuiPaper>
  );
},
```
