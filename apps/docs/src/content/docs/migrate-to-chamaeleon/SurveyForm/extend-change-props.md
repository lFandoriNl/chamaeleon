---
title: Extend change props
description: Extend change props
sidebar:
  order: 9
---

We have a lot of props that require customization, let's do them

## Paper

`Paper` lacks the ability to customize its padding. To customize styles, we create a separate `ChangeStyle` plugin for this.

```diff lang="ts"
// builder/plugins/paper.tsx
addBlock({
  name: 'paper',
  allowContent: {
    name: ['*', '!root', '!paper'],
  },
+  style: {
    // This is the name of the layer, with the help of
    // layers you can separate styles if you have a complex block
    // The root layer should always be there
+    root: {
      // If you don't want the default value,
      // you can set it to undefined
+      padding: 4,
+    },
+  },
  components: {
-    view: ({ children }) => {
-      return <MuiPaper sx={{ p: 4 }}>{children}</MuiPaper>;
+    view: ({ block, children }) => {
+      return <MuiPaper sx={{ ...block.style.root }}>{children}</MuiPaper>;
    },
     editor: ({ block, children }) => {
+      const ref = useRef<HTMLDivElement>(null);

      return (
        <>
-          <MuiPaper sx={{ p: 4 }}>
+          <MuiPaper ref={ref} sx={{ ...block.style.root }}>
            {children}

            <Box display="flex" justifyContent="center">
              <AddNewBlock id={block.id} />
            </Box>
          </MuiPaper>

+          <editor.view.ui.ActionPopover referenceRef={ref}>
+            <BlockToolbar id={block.id} />
+          </editor.view.ui.ActionPopover>
        </>
      )
```

```tsx
// builder/plugins/change-style.tsx
import { Plugin } from '@chamaeleon/core';
import TextField from '@mui/material/TextField';

export function ChangeStyle(): Plugin {
  return {
    name: 'change-style',
    apply(editor, { addStyleView }) {
      addStyleView({
        // The addStyleView filter is different from addPropsView,
        // the first parameter comes a style specification,
        // exactly the object that we pass to addBlock
        filter(styleSpec) {
          return 'padding' in styleSpec;
        },
        // "style" is the equivalent of block.style[layer]
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
```

Adding to editor

```diff lang="ts"
// demo.tsx
+import { ChangeStyle } from './builder/plugins/change-style';

const editor = new Editor({
  plugins: [
    // ...
    Root(),
    Paper(),
    Stack(),
    Text(),
    TextField(),
    Button(),
    BlockSettings()
    ChangeProps(),
+    ChangeStyle()
  ],
});
```

Now let's add to our `BlockSettings` the rendering of our components to change styles

```diff lang="tsx"
// builder/plugins/block-settings.tsx
function DrawerBody(...) {
  const targetBlock = editor.state.getBlock(target);

  return (
    <>
      <Stack spacing={4} p={3}>
      ...
      {editor.view.pluginPropsViews.map(
        ({ id, view: { filter, component: Component } }) => {
          if (!filter(targetBlock)) return null;

          return <Component key={id} editor={editor} block={targetBlock} />;
        },
      )}

+      {Object.entries(targetBlock.type.style)
+        .map(([layer, cssProperties]) => {
+          return (
+            <Stack key={layer} spacing={3}>
+              <Typography
+                sx={{ lineHeight: '3rem', borderBottom: '1px solid #ccc' }}
+              >
+                {layer}
+              </Typography>
+
+              {editor.view.pluginStyleViews.map(
+                ({ id, view: { filter, component: Component } }) => {
+                  if (!targetBlock) return null;
+
+                  if (!filter(cssProperties, targetBlock, layer)) return null;
+
+                  return (
+                    <Component
+                      key={id}
+                      editor={editor}
+                      layer={layer}
+                      styleSpec={cssProperties}
+                      style={targetBlock.style[layer] || {}}
+                      block={targetBlock}
+                    />
+                  );
+                },
+              )}
+            </Stack>
+          );
+        })
+        .flat()}
      </Stack>
    </>
  );
}
```

Great, we now have the ability to edit the padding, now if we need to add it to another component, all we need to do is add the padding to the component's styles section

## Stack

For the `Stack` we need to add `spacing` and `direction` prop settings

```diff lang="tsx"
// builder/plugins/stack.tsx
addBlock({
  name: 'stack',
  allowContent: {
    name: ['*', '!root'],
  },
+  props: {
+    spacing: {
+      default: 4,
+    },
+    direction: {
+      default: 'column',
+    },
+  },
  components: {
-    view: ({ children }) => {
+    view: ({ block, children }) => {
      return (
-        <MuiStack spacing={4}>
+        <MuiStack
+          spacing={block.props.spacing}
+          direction={block.props.direction}
+        >
          {children}
        </MuiStack>
      );
    },
    editor: ({ block, children }) => {
+      const ref = useRef<HTMLDivElement>(null);

      return (
        <>
-          <MuiStack spacing={4}>
+          <MuiStack
+            ref={ref}
+            spacing={block.props.spacing}
+            direction={block.props.direction}
+          >
            {children}

            <Box display="flex" justifyContent="center">
              <AddNewBlock id={block.id} />
            </Box>
          </MuiStack>

+          <editor.view.ui.ActionPopover referenceRef={ref}>
+            <BlockToolbar id={block.id} />
+          </editor.view.ui.ActionPopover>
        </>
      );
    },
    ...
  },
});
```

```tsx
// builder/plugins/change-props
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

          const isNumber = String(parsed).length === event.target.value.length;

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

addPropsView({
  filter(block) {
    return block.props.direction !== undefined;
  },
  component: ({ block }) => {
    return (
      <TextField
        select
        label="Direction"
        value={block.props.direction}
        onChange={(event) => {
          editor.commands.changeProperty(
            block.id,
            'direction',
            event.target.value,
          );
        }}
      >
        {['row', 'row-reverse', 'column', 'column-reverse'].map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
    );
  },
});
```

## Text

For the `Text` block, add `padding` styles

```diff lang="tsx"
// builder/plugins/text
addBlock({
  name: 'text',
  props: {
    content: {
      default: 'Enter your text',
    },
  },
+  style: {
+    root: {
+      padding: '0 0 16px 0',
+    },
+  },
  components: {
    view: ({ block }) => {
      return (
-        <Typography sx={{ pb: 2 }}>{block.props.content}</Typography>
+        <Typography sx={{ ...block.style.root }}>
+          {block.props.content}
+        </Typography>
      );
    },
-    editor: ({ block }) => {
+    editor: ({ block, editor }) => {
      const ref = useRef<HTMLParagraphElement>(null);

      return (
        <>
-         <Typography sx={{ pb: 2 }}>{block.props.content}</Typography>
+          <Typography ref={ref} sx={{ ...block.style.root }}>
+            {block.props.content}
+          </Typography>
+
+          <editor.view.ui.ActionPopover referenceRef={ref}>
+            <BlockToolbar id={block.id} />
+          </editor.view.ui.ActionPopover>
        </>
      );
    },
    palette: () => {
      return <Typography>Text</Typography>;
    },
  },
});
```

## TextField

For `TextField` you need to add editing `label` and `fieldName` props

```diff lang="tsx"
// builder/plugins/text-field.tsx
addBlock({
  name: 'text-field',
  props: {
    label: {
      default: 'Label',
    },
    fieldName: {
      default: '',
    },
  },
  components: {
    view: ...
    editor: ({ block }) => {
+      const ref = useRef<HTMLDivElement>(null);

      const { control } = useFormContext();

      return (
        <>
          <Controller
            name={block.props.fieldName}
            control={control}
            shouldUnregister
            render={({ field }) => (
              <MuiTextField
                inputRef={ref}
                label={block.props.label}
                variant="outlined"
                {...field}
                value={field.value || ''}
              />
            )}
          />

+          <editor.view.ui.ActionPopover referenceRef={ref}>
+            <BlockToolbar id={block.id} />
+          </editor.view.ui.ActionPopover>
        </>
      );
    },
    palette: () => {
      return <Typography>TextField</Typography>;
    },
  },
});
```

Since we already have a component for changing the `content` prop, we can generate similar components by changing only the prop keys, collecting them in an array

```diff lang="tsx"
// builder/plugins/change-props.tsx
+[
+  { label: 'Content', propName: 'content', valueIfEmpty: 'Empty' },
+  { label: 'Label', propName: 'label' },
+  { label: 'FieldName', propName: 'fieldName' },
+].forEach(({ label, propName, valueIfEmpty }) => {
  addPropsView({
    filter(block) {
-      return block.props.content !== undefined;
+      return block.props[propName] !== undefined;
    },
    component: ({ block }) => {
      return (
        <TextField
-          label="Content"
-          value={block.props.content}
+          label={label}
+          value={block.props[propName]}
          onChange={(event) =>
            editor.commands.changeProperty(
              block.id,
-              "Content",
-              event.target.value || 'Empty',
+              propName,
+              event.target.value || valueIfEmpty || '',
            )
          }
        />
      );
    },
  });
});
```

## Button

Make the rest of the button `type` and `variant` props, as with TextField, you can group selects into an array

```diff lang="tsx"
// builder/plugins/change-props.tsx
+[
+  {
+    label: 'Direction',
+    propName: 'direction',
+    items: ['row', 'row-reverse', 'column', 'column-reverse'],
+  },
+  {
+    label: 'Type',
+    propName: 'type',
+    items: ['button', 'submit', 'reset'],
+  },
+  {
+    label: 'Variant',
+    propName: 'variant',
+    items: ['contained', 'outlined', 'text'],
+  },
+].forEach(({ label, propName, items }) => {
  addPropsView({
    filter(block) {
-      return block.props[propName] !== undefined;
+      return block.props.direction !== undefined;
    },
    component: ({ block }) => {
      return (
        <TextField
          select
-          label="Direction"
-          value={block.props.direction}
+          label={label}
+          value={block.props[propName]}
          onChange={(event) => {
            editor.commands.changeProperty(
              block.id,
-              "direction",
+              propName,
              event.target.value,
            );
          }}
        >
-          {['row', 'row-reverse', 'column', 'column-reverse'].map((item) => (
+          {items.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      );
    },
  });
});
```
