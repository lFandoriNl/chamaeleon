import { forwardRef, HTMLAttributes } from 'react';
import clsx from 'clsx';

import { useFormControl } from '../form-control/use-form-control';

export type InputProps = HTMLAttributes<HTMLInputElement> & {
  value?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  error?: boolean;
  disabled?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, size = 'md', error: _, ...rest } = props;

  const { id, isError, isDisabled } = useFormControl(props);

  return (
    <input
      ref={ref}
      id={id}
      className={clsx(
        className,
        'ui-input',
        'relative rounded border border-gray-300 outline-none transition-all duration-200',
        'focus-visible:z-10 focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600',
        {
          'hover:border-gray-400': !isError,
          'border-red-500': isError,
        },
        {
          xs: 'h-6 px-2 text-xs',
          sm: 'h-8 px-3 text-sm',
          md: 'h-10 px-4 text-base',
          lg: 'h-12 px-4 text-lg',
        }[size],
        isDisabled && 'pointer-events-none border-gray-400 bg-slate-50',
      )}
      disabled={isDisabled}
      {...rest}
    />
  );
});

Input.displayName = 'Input';
