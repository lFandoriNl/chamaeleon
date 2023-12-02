---
title: Drag and drop
description: Add Drag and drop to blocks
sidebar:
  order: 10
---

We have almost finished our builder, almost the most important thing remains, this is drag and drop!

Chameleon provides two wrapper components for implementing drag and drop, these are `Draggable` and `Dropzone`

`Draggable` - what we drag

`Dropzone` - area where blocks can be dropped

There is also a hook `view.dragAndDrop.useBlockState(block)` which provides information about whether the dragged block is currently located above the block or whether the block is available for dropping a block into it

## Root

Let's look at an example of integrating drag and drop into the `Root` block

```diff lang="tsx"
// builder/plugins/root.tsx
editor: ({ block, children }) => {
+  const { view } = editor;

  return (
    <>
-      {children}
+      <view.Dropzone block={block}>
+        <div>{children}</div>
+      </view.Dropzone>

      <Box display="flex" justifyContent="center">
        <AddNewBlock id={block.id} />
      </Box>
    </>
  );
}
```

As you can see, we simply wrap our children in a `Dropzone` and pass our block to props

Please note that Dropzone requires that the child be of type ReactElement and be able to accept ref, so we wrapped our children in div

## Paper

Paper is already draggable and has Dropzone

```diff lang="tsx"
// builder/plugins/paper.tsx
editor: ({ block, children }) => {
  const { view } = editor;

  const ref = useRef<HTMLDivElement>(null);

+  const { isOver, isAvailableDrop } = view.dragAndDrop.useBlockState(block);

  return (
-    <>
+    <view.Draggable id={block.id}>
+      <view.Dropzone>
        <MuiPaper
          ref={ref}
          sx={{
            ...block.style.root,
+            ...(isAvailableDrop && {
+              outline: '2px solid limegreen',
+            }),
+            ...(isOver && {
+              outline: '2px solid blue',
+            }),
+            '&:hover': {
+              outline: '2px solid blue',
+            },
          }}
        >
          {children}

          <Box display="flex" justifyContent="center">
            <AddNewBlock id={block.id} />
          </Box>
        </MuiPaper>
+      </view.Dropzone>

      <view.ui.ActionPopover referenceRef={ref}>
        <BlockToolbar id={block.id} />
      </view.ui.ActionPopover>
-    </>
+    </view.Draggable>
  );
};
```

Here we already wrap the block in the `Draggable` component to which we pass the id of our block, because of this, the internal `Dropzone` no longer needs to forward the block since it will take it from `Draggable`

Using the result of `useBlockState` we also add various highlight effects, but writing this every time can be tedious, let's move this logic into a separate hook

```ts
// builder/ui/use-highlight-styles.ts
import { Block } from '@chamaeleon/core';
import { useEditor } from '@chamaeleon/react-editor';

export function useHighlightStyles(block: Block) {
  const { view } = useEditor();

  const { isOver, isAvailableDrop } = view.dragAndDrop.useBlockState(block);

  return {
    ...(isAvailableDrop && {
      outline: '2px solid limegreen',
    }),
    ...(isOver && {
      outline: '2px solid blue',
    }),
    '&:hover': {
      outline: '2px solid blue',
    },
  };
}
```

It already looks better

```diff lang="tsx"
// builder/plugins/paper.tsx
editor: ({ block, children }) => {
  const { view } = editor;

  const ref = useRef<HTMLDivElement>(null);

+  const styles = useHighlightStyles(block);

  return (
    <view.Draggable id={block.id}>
      <view.Dropzone>
        <MuiPaper
          ref={ref}
          sx={{
            ...block.style.root,
-            ...(isAvailableDrop && {
-              outline: '2px solid limegreen',
-            }),
-            ...(isOver && {
-              outline: '2px solid blue',
-            }),
-            '&:hover': {
-              outline: '2px solid blue',
+            ...styles,
          }}
        >
          {children}

          <Box display="flex" justifyContent="center">
            <AddNewBlock id={block.id} />
          </Box>
        </MuiPaper>
      </view.Dropzone>

      <view.ui.ActionPopover referenceRef={ref}>
        <BlockToolbar id={block.id} />
      </view.ui.ActionPopover>
    </view.Draggable>
  );
},
```

## Stack

`Stack` is just like `Paper`

```diff lang="tsx"
// builder/plugins/stack.tsx
editor: ({ block, children }) => {
  const { view } = editor;

  const ref = useRef<HTMLDivElement>(null);

+  const styles = useHighlightStyles(block);

  return (
-    <>
+    <view.Draggable id={block.id}>
+      <view.Dropzone>
        <MuiStack
          ref={ref}
          spacing={block.props.spacing}
          direction={block.props.direction}
-          sx={{ px: 2 }}
+          sx={{ px: 2, ...styles }}
        >
          {children}

          <Box display="flex" justifyContent="center">
            <AddNewBlock id={block.id} />
          </Box>
        </MuiStack>
+      </view.Dropzone>

      <view.ui.ActionPopover referenceRef={ref}>
        <BlockToolbar id={block.id} />
      </view.ui.ActionPopover>
-    </>
+    </view.Draggable>
  );
};
```

## Text

`Text` can only be dragged and dropped

```diff lang="tsx"
// builder/plugins/text.tsx
editor: ({ block, editor }) => {
  const { view } = editor;

  const ref = useRef<HTMLParagraphElement>(null);

+  const styles = useHighlightStyles(block);

  return (
-    <>
-      <Typography ref={ref} sx={block.style.root}>
+    <view.Draggable id={block.id}>
+      <Typography ref={ref} sx={{ ...block.style.root, ...styles }}>
        {block.props.content}
      </Typography>

      <view.ui.ActionPopover referenceRef={ref}>
        <BlockToolbar id={block.id} />
      </view.ui.ActionPopover>
-    </>
+    </view.Draggable>
  );
};
```

## TextField

`TextField` has a more complex case

```diff lang="tsx"
// builder/plugins/text-field.tsx
editor: ({ block }) => {
  const { view } = editor;

  const referenceRef = useRef<HTMLDivElement>(null);

  const { control } = useFormContext();

+  const styles = useHighlightStyles(block);

  return (
-    <>
+    <view.Draggable id={block.id} ref={referenceRef}>
+      {({ ref, attrs, listeners, style }) => (
+        <>
          <Controller
            name={block.props.fieldName}
            control={control}
            shouldUnregister
            render={({ field }) => (
              <MuiTextField
+                inputRef={ref}
                label={block.props.label}
                variant="outlined"
                {...field}
                value={field.value || ''}
+                {...attrs}
+                {...listeners}
+                sx={{ ...styles, ...style }}
              />
            )}
          />

          <view.ui.ActionPopover referenceRef={referenceRef}>
            <BlockToolbar id={block.id} />
          </view.ui.ActionPopover>
+        </>
      )}
-    </>
+    </view.Draggable>
  );
};
```

In this case we couldn't just do

```tsx
<view.Draggable id={block.id}>
  <Controller
```

Because the `Controller` does not accept ref, for such cases `Draggable` can use render prop for children, the arguments we receive is an object `{ ref, attrs, listeners, style }` whose values we must pass to the component that will be `Draggable`

We also passed the ref to Draggable, this ref will be combined with the ref for Draggable and passed to the render prop

```tsx
<view.Draggable id={block.id} ref={referenceRef}>
  {({ ref, attrs, listeners, style }) => (
    ...
    <MuiTextField
      // ref is a combined referenceRef for Popover and ref for Draggable
      inputRef={ref}
```

This is done in order not to have to manually combine refs for transfer to the component, as in our component, we have one ref for Popover and a second for Draggable

## Button

`Button` is just like `Text`

```diff lang="tsx"
editor: ({ block }) => {
  const { view } = editor;

  const { type, variant, content } = block.props;

  const ref = useRef<HTMLButtonElement>(null);

+  const styles = useHighlightStyles(block);

  return (
-    <>
-      <MuiButton ref={ref} type={type} variant={variant}>
+    <view.Draggable id={block.id}>
+      <MuiButton ref={ref} type={type} variant={variant} sx={styles}>
        {content}
      </MuiButton>

      <view.ui.ActionPopover referenceRef={ref}>
        <BlockToolbar id={block.id} />
      </view.ui.ActionPopover>
-    </>
+    </view.Draggable>
  );
};
```
