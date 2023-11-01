import React, { forwardRef, HTMLAttributes } from 'react';
import clsx from 'clsx';

export type InputProps = HTMLAttributes<HTMLInputElement> & {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  value?: string;
  error?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = 'md',
      value,
      error,
      disabled,
      children,
      onChange,
      ...props
    },
    ref,
  ) => {
    return (
      <input
        ref={ref}
        className={clsx(
          className,
          'ui-input',
          'relative rounded border border-gray-300 outline-none transition-all duration-200 hover:border-gray-400',
          'focus-visible:z-10 focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600',
          error && 'border-red-500',
          {
            xs: 'h-6 px-2 text-xs',
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4 text-base',
            lg: 'h-12 px-4 text-lg',
          }[size],
          disabled && 'pointer-events-none border-gray-400 bg-slate-50',
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
