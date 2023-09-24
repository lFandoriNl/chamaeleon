import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';

export type IconButtonProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function IconButton({
  className,
  children,
  onClick,
}: IconButtonProps): React.ReactNode {
  return (
    <button
      className={clsx(
        'ui-icon-button',
        'p-1.5 rounded-full shadow-xl',
        'border bg-white hover:bg-slate-100 active:bg-slate-200',
        'focus:outline-none focus:relative focus:ring focus:ring-blue-600',
        '[&>svg]:pointer-events-none',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
