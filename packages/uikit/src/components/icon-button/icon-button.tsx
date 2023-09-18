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
        'p-2 rounded-full shadow-xl',
        'bg-white hover:bg-slate-300',
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
