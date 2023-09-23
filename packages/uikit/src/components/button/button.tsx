import clsx from 'clsx';
import React from 'react';

export type ButtonProps = {
  className?: string;
  color?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function Button(props: ButtonProps): React.ReactNode {
  return (
    <button
      className={clsx(
        props.className,
        'ui-button',
        'rounded-xl',
        'focus:outline-none focus:relative focus:ring focus:ring-blue-600',
        {
          large: 'py-2 px-4 text-lg',
          medium: 'py-1.5 px-3 text-base',
          small: 'py-1 px-2 text-sm',
        }[props.size || 'medium'],
        {
          primary:
            'bg-green-500 text-green-50 hover:bg-green-600 active:bg-green-700',
          secondary:
            'bg-blue-500 text-blue-50 hover:bg-blue-600 active:bg-blue-700',
        }[props.color || 'primary'],
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
