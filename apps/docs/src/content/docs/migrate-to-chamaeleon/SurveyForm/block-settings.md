---
title: Block settings
description: Creating a block settings
sidebar:
  order: 8
---

In this part we will make a BlockSettings plugin, it will have commands for opening the block settings in the Drawer where suitable components will be rendered to change the block props

```tsx
// builder/plugins/block-settings.tsx
import { Block, Plugin } from '@chamaeleon/core';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import capitalize from '@mui/material/utils/capitalize';
import ReactDOM from 'react-dom';

// Our plugin will have two commands for opening
// and closing Drawer so that typescript knows about them,
// we use this code to extend the basic commands with our own
declare module '@chamaeleon/core' {
  interface Commands<ReturnType> {
    'block-settings': {
      openBlockSettings: (target: Block['id']) => ReturnType;
      closeBlockSettings: () => ReturnType;
    };
  }
}

// Plugins can have their own state, in our plugin
// we will have the open state of Drawer and
// the current Block['id'] for which settings are displayed
type State = {
  opened: boolean;
  target?: Block['id'];
};

export function BlockSettings(): Plugin<State> {
  return {
    name: 'block-settings',
    state: {
      // Here you need to set initial state
      init() {
        return {
          opened: false,
        };
      },
      // The apply method is a more advanced method for changing state,
      // it is called on every change in the state of the editor,
      // it has the ability to access transactions that are applied to the state.
      // Now we simply return the current state of the plugin without modifying it
      apply(_, value) {
        return value;
      },
    },
    apply(editor, { addCommands, addView, setState, usePluginState }) {
      // "addCommands" are used to expand editor commands
      addCommands({
        // A command is a function that returns a function
        // (...yourArgs) => (context) => void
        // The first function contains your custom arguments,
        // and the second contains the context,
        // which includes the editor, commands, transaction, etc.
        openBlockSettings(target) {
          return () => {
            // "setState" is a method for setting the state of the plugin
            setState({
              opened: true,
              target,
            });
          };
        },
        closeBlockSettings() {
          return () => {
            setState((prev) => ({
              ...prev,
              opened: false,
            }));
          };
        },
      });

      // addView allows you to add any components, you can use
      // the react portal to control the rendering location
      addView({
        component: () => {
          // api "usePluginState" is similar to React.useState
          const [{ opened, target }] = usePluginState();

          return ReactDOM.createPortal(
            <Drawer
              anchor="right"
              open={opened}
              onClose={editor.commands.closeBlockSettings}
              sx={{
                '.MuiPaper-root': {
                  maxWidth: 400,
                  width: '100%',
                },
              }}
            >
              {target && <DrawerBody target={target} editor={editor} />}
            </Drawer>,
            document.body,
          );
        },
      });
    },
  };
}

function DrawerBody({
  target,
  editor,
}: {
  target: Block['id'];
  editor: Editor;
}) {
  const targetBlock = editor.state.getBlock(target);

  return (
    <Stack spacing={4} p={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">
          {capitalize(editor.state.getBlock(target).type.name)} settings
        </Typography>

        <IconButton
          aria-label="close block settings"
          onClick={editor.commands.closeBlockSettings}
        >
          <CloseIcon />
        </IconButton>
      </Stack>

      {/* "editor.view.pluginPropsViews" contains
      an array of all Views from all plugins,
      this is the same object that is passed to "addPropsView" */}
      {editor.view.pluginPropsViews.map(
        ({ id, view: { filter, component: Component } }) => {
          // get targetBlock from state
          const targetBlock = editor.state.getBlock(target);

          // determine whether the component needs
          // to be rendered for this block
          if (!filter(targetBlock)) return null;

          // And we render it!
          return <Component key={id} editor={editor} block={targetBlock} />;
        },
      )}
    </Stack>
  );
}
```

Adding to editor

```diff lang="ts"
// demo.tsx
+import { BlockSettings } from './builder/plugins/block-settings';

const editor = new Editor({
  plugins: [
    // ...
    Root(),
    Paper(),
    Stack(),
    Text(),
    TextField(),
    Button(),
    ChangeProps(),
+    BlockSettings()
  ],
});
```

Great, our settings are ready! All that remains is to show the toolbar when you hover over the component where you can open the settings

```tsx
// builder/ui/block-toolbar.tsx
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export function BlockToolbar({ id }: { id: Block['id'] }) {
  const editor = useEditor();

  return (
    <ButtonGroup variant="contained" size="small" aria-label="Block toolbar">
      <Button
        aria-label="Remove block"
        onClick={() => editor.commands.remove(id)}
      >
        <DeleteIcon />
      </Button>

      <Button
        size="small"
        aria-label="Open block settings"
        onClick={() => editor.commands.openBlockSettings(id)}
      >
        <SettingsIcon />
      </Button>
    </ButtonGroup>
  );
}
```

```diff lang="tsx"
// builder/plugins/button.tsx
editor: ({ block }) => {
+  const { view } = editor;
  const { type, variant, content } = block.props;

+  const ref = useRef<HTMLButtonElement>(null);

  return (
    <>
-     <MuiButton type={type} variant={variant}>
+     <MuiButton ref={ref} type={type} variant={variant}>
        {content}
      </MuiButton>

+      <view.ui.ActionPopover referenceRef={ref}>
+        <BlockToolbar id={block.id} />
+      </view.ui.ActionPopover>
    </>
  );
},
```

Now, when you hover over the button, a popover with a toolbar appears, and when we click on the settings button, our drawer opens with input to change the text
