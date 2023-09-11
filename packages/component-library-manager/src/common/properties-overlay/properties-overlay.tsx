import React from 'react';
import { IoSettingsOutline } from 'react-icons/io5';

import { IconButton } from '@chameleon/uikit';

type PropertiesOverlayProps = {
  children: React.ReactNode | React.ReactNode[];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function PropertiesOverlay({
  children,
  onClick,
}: PropertiesOverlayProps) {
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
