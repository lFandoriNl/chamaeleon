import clsx from 'clsx';
import React from 'react';

export type PanelButtonProps = {
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function PanelButton(props: PanelButtonProps): React.ReactNode {
  return (
    <button
      className={clsx(
        'h-16 m-2 p-4 rounded-xl',
        'bg-opacity-50 bg-slate-300 hover:bg-slate-300 active:bg-slate-400',
        'focus:outline-none focus:ring focus:ring-slate-400',
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
