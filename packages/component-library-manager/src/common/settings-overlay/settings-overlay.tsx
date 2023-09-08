import React from 'react';
import clsx from 'clsx';
import { IoSettingsOutline } from 'react-icons/io5';

type SettingsOverlayProps = {
  children: React.ReactNode | React.ReactNode[];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function SettingsOverlay({ children, onClick }: SettingsOverlayProps) {
  return (
    <div className="group/overlay relative">
      {children}

      <button
        className={clsx(
          'absolute top-1 right-1 p-1 rounded-xl shadow-xl z-10',
          'bg-white hover:bg-slate-300 hover:pointer-events-auto',
          'hidden group-hover/overlay:block',
        )}
        onClick={onClick}
      >
        <IoSettingsOutline size={24} />
      </button>
    </div>
  );
}
