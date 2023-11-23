---
title: Root block
description: Creating a root block
sidebar:
  order: 3
---

The main block is the simplest component, all it has to do is render all its children elements and provide the ability to add new blocks

Let's start by simply rendering nested blocks

Create a file for our plugin at the following path `builder/plugins/root.tsx`

```tsx
// builder/plugins/root.tsx
import { Plugin } from '@chamaeleon/core';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// we declare our function that will return the plugin
export function Root(): Plugin {
  return {
    // unique plugin name
    name: 'root',
    // apply method is called when the plugin is applied
    //
    // editor - this is the Editor Instance
    //
    // methods - is a set of methods for adding blocks,
    // various components for changing parameters, etc.
    apply(editor, methods) {
      // addBlock accepts our block specification
      methods.addBlock({
        // unique block name
        name: 'root',
        // allowContent configures what blocks our block can have
        // name: ['*', '!root'] - indicates that
        // this block can have all blocks except itself in its children
        allowContent: {
          name: ['*', '!root'],
        },
        // a set of components for displaying a block in different states
        components: {
          // view - to display the block in view mode
          view: ({ children }) => {
            return children;
          },
          // editor - to display the block in edit mode
          editor: ({ children }) => {
            return children;
          },
          // palette - is the component view when
          // selecting components to add a new block
          palette: () => {
            return <Typography>Root</Typography>;
          },
        },
      });
    },
  };
}
```

Great! Now let's connect our plugin to the editor

```diff lang="ts"
// demo.tsx
+import { Root } from './builder/plugins/root';

const editor = new Editor({
  plugins: [
    Persist(),
    History(),
+    Root()
  ],
});
```

Now that we've added our first block, we can start rendering our editor in `survey-form.tsx`

```diff lang="tsx"
// pages/survey-form/survey-form.tsx
import { EditorContent, useEditor } from '@chamaeleon/react-editor';

export function SurveyForm() {
  const editor = useEditor();

  return (
    <Stack component="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
      {/* empty this ReactNode shows when the editor state
      is empty, pass the component that adds the root block */}
+      <EditorContent editor={editor} empty={<AddRootBlock />} />
    </Stack>
  );
}

+function AddRootBlock() {
+  const editor = useEditor();
+
+  return (
+    <Paper
+      sx={{
+        p: 4,
+        display: 'flex',
+        justifyContent: 'center',
+      }}
+    >
+      <Button
+        variant="contained"
+        onClick={() => {
+          // To add a main block, there is the insertRootContent command,
+          // which accepts JSONContent with a required id
+          // from editor.schema.spec.rootBlockId
+          editor.commands.insertRootContent({
+            id: editor.schema.spec.rootBlockId,
+            // block name
+            type: 'root',
+          });
+        }}
+      >
+        Add first page
+      </Button>
+    </Paper>
+  );
+}
```

Now if we click on the button, empty will disappear and our block root component will be rendered
