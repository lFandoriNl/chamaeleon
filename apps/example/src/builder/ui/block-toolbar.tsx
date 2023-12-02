import { Block } from '@chamaeleon/core';
import { useEditor } from '@chamaeleon/react-editor';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SettingsIcon from '@mui/icons-material/Settings';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export function BlockToolbar({ id }: { id: Block['id'] }) {
  const editor = useEditor();

  const dndConnector = editor.view.dragAndDrop.useDndConnector();

  return (
    <ButtonGroup variant="contained" size="small" aria-label="Block toolbar">
      {dndConnector.withActivator && (
        <Button
          ref={dndConnector.ref}
          aria-label="Drag"
          sx={{ cursor: 'grab' }}
          {...dndConnector.attributes}
          {...dndConnector.listeners}
        >
          <DragIndicatorIcon />
        </Button>
      )}

      <Button
        aria-label="Remove block"
        onClick={() => editor.commands.remove(id)}
      >
        <DeleteIcon />
      </Button>

      <Button
        aria-label="Open block settings"
        onClick={() => editor.commands.openBlockSettings(id)}
      >
        <SettingsIcon />
      </Button>
    </ButtonGroup>
  );
}
