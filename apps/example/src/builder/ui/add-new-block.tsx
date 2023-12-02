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
