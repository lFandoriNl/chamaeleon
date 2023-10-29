import React, { forwardRef, HTMLAttributes } from 'react';
import clsx from 'clsx';

export type InputProps = HTMLAttributes<HTMLInputElement> & {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  value?: string;
  disabled?: boolean;
  children?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, value, disabled, children, onChange, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          className,
          'ui-input',
          'rounded',
          'border focus:border-blue-600',
          {
            large: 'px-4 py-2 text-lg',
            medium: 'px-3 py-1.5 text-base',
            small: 'px-2 py-1 text-sm',
          }[size || 'medium'],
          disabled && 'pointer-events-none bg-gray-400',
        )}
        value={value}
        disabled={disabled}
        onChange={onChange}
        {...props}
      >
        {children}
      </input>
    );
  },
);

Input.displayName = 'Input';
