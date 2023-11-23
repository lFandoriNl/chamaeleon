import { Block } from '@chamaeleon/core';
import { useEditor } from '@chamaeleon/react-editor';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SettingsIcon from '@mui/icons-material/Settings';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';

export function BlockToolbar({ id }: { id: Block['id'] }) {
  const editor = useEditor();

  return (
    <ButtonGroup
      disableElevation
      variant="contained"
      aria-label="Block toolbar"
      sx={{
        backgroundColor: 'white',
      }}
    >
      <IconButton size="small" aria-label="drag" sx={{ cursor: 'grab' }}>
        <DragIndicatorIcon />
      </IconButton>

      <IconButton
        size="small"
        aria-label="open block settings"
        onClick={() => editor.commands.openBlockSettings(id)}
      >
        <SettingsIcon />
      </IconButton>
    </ButtonGroup>
  );
}
