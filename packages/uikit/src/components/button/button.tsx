import React, { forwardRef, HTMLAttributes } from 'react';
import clsx from 'clsx';

export type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  className?: string;
  color?: 'primary' | 'secondary';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, color, size = 'md', disabled, children, onClick, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          className,
          'ui-button',
          color,
          'relative cursor-pointer rounded-lg border-0',
          'focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
          {
            xs: 'h-6 px-2 text-xs',
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4 text-base',
            lg: 'h-12 px-4 text-lg',
          }[size],
          {
            primary:
              'bg-emerald-500 text-green-50 hover:bg-emerald-600 active:bg-emerald-700',
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
