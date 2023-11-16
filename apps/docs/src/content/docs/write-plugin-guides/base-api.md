---
title: Base API
description: Using the undo redo commands feature with Chamaeleon
---

Chamaeleon is primarily a framework for creating ui-builder, because out of the box it provides a small number of blocks, these are a `page`, a `row`, a `column` and `text`. During the development process, the basic blocks will be replenished.

But most likely you will only use `row` and `column` from the basic blocks, because you will have your own design and your own blocks or sets of them, so make them using plugins!

Let's get acquainted with the basic capabilities of the `Plugin API` and write our own `Button` block:

```tsx
import { Plugin } from '@chamaeleon/core';

export function Button(): Plugin {
  return {
    name: 'button',
    apply(editor, { addBlock }) {
      addBlock({
        name: 'button',
        props: {
          content: {
            default: 'Button',
          },
        },
        style: {
          root: {
            margin: 0,
          },
        },
        components: {
          view: ({ block }) => {
            return (
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                style={block.style.root}
              >
                {block.props.value}
              </button>
            );
          },
          editor: ({ block }) => {
            return (
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                style={block.style.root}
              >
                {block.props.value}
              </button>
            );
          },
          palette: () => {
            return <div>Button</div>;
          },
        },
      });
    },
  };
}
```

We create a function that returns the plugin type, more details about each property:

`name` - the name of our plugin, please note that this name must be unique for all plugins that are loaded into the editor

`apply` - called immediately before using the plugin, the function takes two arguments, the first is the instance of the editor itself, and the second is a set of methods with which you can expand the editor with your own blocks/components to change props or styles etc.

To add a new block, we use the `addBlock` function from the `methods`, where we pass the following parameters:

- `name` - the name of our block, must be unique
- `props` - this object describes the parameters of our block; they can be changed in the property editor
- `style` - this object, by analogy with parameters, describes the styles of the component, styles can be divided into layers, but the main `root` layer must always be defined
- `components` - set of different block display options
  - `view` component for display by the editor in `view mode`
  - `editor` component for display by the editor in `edit mode`
  - `palette` for rendering a component selection from a `palette`

Now the view and editor components are similar to each other, this is because in edit mode we do not change our button in any way.

Let's make sure that when you hover the mouse over our button, a Popover will be shown with a button that, when clicked, will open a drawer with editing the properties of our button:

```ts
editor: ({ block }) => {
  const { ui } = editor.view;

  const referenceRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={referenceRef}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        style={block.style.root}
      >
        {block.props.value}
      </button>

      <ui.ActionPopover referenceRef={referenceRef} placement="top-end">
        <ui.ActionSettingsButton
          onClick={(event) => {
            editor.commands.intention(
              block.id,
              'change-properties',
              event.nativeEvent,
            );
          }}
        />
      </ui.ActionPopover>
    </>
  );
};
```

Here we get a ui object from our `editor.view`, this is the internal components of the editor for buttons/popovers, so using `ui.ActionPopover` we add a hover popover to our button that displays a button for settings at the top right
`ui.ActionSettingsButton`.

When you click on the button, a service command of the editor is called which reports that there is an intention to change the parameters of the component, this command is listened to by another plugin that intercepts it and opens these settings.

Great, our plugin is ready, all that remains is to connect it to our editor:

```ts
const editor = new Editor({
  plugins: [
    // other plugins
    Button(),
  ],
});
```
