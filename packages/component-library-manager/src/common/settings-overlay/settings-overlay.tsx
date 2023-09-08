import React from 'react';
import { IoSettingsOutline } from 'react-icons/io5';

import { IconButton } from '@chameleon/uikit';

type SettingsOverlayProps = {
  children: React.ReactNode | React.ReactNode[];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function SettingsOverlay({ children, onClick }: SettingsOverlayProps) {
  return (
    <div className="group/overlay relative">
      {children}

      <IconButton
        className="absolute top-1 right-1 z-10 hidden group-hover/overlay:block"
        onClick={onClick}
      >
        <IoSettingsOutline size={24} />
      </IconButton>
    </div>
  );
}
