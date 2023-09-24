import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';

export type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  className?: string;
  color?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function Button({
  className,
  color,
  size,
  children,
  onClick,
  ...props
}: ButtonProps): React.ReactNode {
  return (
    <button
      className={clsx(
        className,
        'ui-button',
        color,
        'rounded-xl',
        'focus:outline-none focus:relative focus:ring focus:ring-blue-600',
        {
          large: 'py-2 px-4 text-lg',
          medium: 'py-1.5 px-3 text-base',
          small: 'py-1 px-2 text-sm',
        }[size || 'medium'],
        {
          primary:
            'bg-green-500 text-green-50 hover:bg-green-600 active:bg-green-700',
          secondary:
            'bg-blue-500 text-blue-50 hover:bg-blue-600 active:bg-blue-700',
        }[color || 'primary'],
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
