import clsx from 'clsx';
import React from 'react';

export type IconButtonProps = {
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function IconButton(props: IconButtonProps): React.ReactNode {
  return (
    <button
      className={clsx(
        'ui-icon-button',
        'p-1.5 rounded-full shadow-xl',
        'border bg-white hover:bg-slate-100 active:bg-slate-200',
        'focus:outline-none focus:relative focus:ring focus:ring-blue-600',
        '[&>svg]:pointer-events-none',
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
