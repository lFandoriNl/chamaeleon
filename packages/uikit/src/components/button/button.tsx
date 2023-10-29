import React, { forwardRef, HTMLAttributes } from 'react';
import clsx from 'clsx';

export type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  className?: string;
  color?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, color, size, disabled, children, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          className,
          'ui-button',
          color,
          'rounded-lg border',
          'focus:relative focus:outline-none focus:ring focus:ring-blue-600',
          {
            large: 'px-4 py-2 text-lg',
            medium: 'px-3 py-1.5 text-base',
            small: 'px-2 py-1 text-sm',
          }[size || 'medium'],
          {
            primary:
              'bg-green-500 text-green-50 hover:bg-green-600 active:bg-green-700',
            secondary:
              'bg-blue-500 text-blue-50 hover:bg-blue-600 active:bg-blue-700',
          }[color || 'primary'],
          disabled && 'pointer-events-none bg-gray-400',
        )}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
