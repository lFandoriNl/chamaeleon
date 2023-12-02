import { Block, Editor, Plugin } from '@chamaeleon/core';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import capitalize from '@mui/material/utils/capitalize';
import ReactDOM from 'react-dom';

declare module '@chamaeleon/core' {
  interface Commands<ReturnType> {
    'block-settings': {
      openBlockSettings: (target: Block['id']) => ReturnType;
      closeBlockSettings: () => ReturnType;
    };
  }
}

type State = {
  opened: boolean;
  target?: Block['id'];
};

export function BlockSettings(): Plugin<State> {
  return {
    name: 'block-settings',
    state: {
      init() {
        return {
          opened: false,
        };
      },
      apply(_, value) {
        return value;
      },
    },
    apply(editor, { addCommands, addView, setState, usePluginState }) {
      addCommands({
        openBlockSettings(target) {
          return () => {
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

      addView({
        component: () => {
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
    <>
      <Stack spacing={4} p={3}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
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

        {editor.view.pluginPropsViews.map(
          ({ id, view: { filter, component: Component } }) => {
            if (!filter(targetBlock)) return null;

            return <Component key={id} editor={editor} block={targetBlock} />;
          },
        )}

        {Object.entries(targetBlock.type.style)
          .map(([layer, cssProperties]) => {
            return (
              <Stack key={layer} spacing={3}>
                <Typography
                  sx={{ lineHeight: '3rem', borderBottom: '1px solid #ccc' }}
                >
                  {layer}
                </Typography>

                {editor.view.pluginStyleViews.map(
                  ({ id, view: { filter, component: Component } }) => {
                    if (!targetBlock) return null;

                    if (!filter(cssProperties, targetBlock, layer)) return null;

                    return (
                      <Component
                        key={id}
                        editor={editor}
                        layer={layer}
                        styleSpec={cssProperties}
                        style={targetBlock.style[layer] || {}}
                        block={targetBlock}
                      />
                    );
                  },
                )}
              </Stack>
            );
          })
          .flat()}
      </Stack>
    </>
  );
}
