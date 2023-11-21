import clsx from 'clsx';
import React, { forwardRef, HTMLAttributes } from 'react';

export type IconButtonProps = HTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'ui-icon-button',
          'relative rounded-full p-1.5 shadow-xl',
          'border bg-white hover:bg-slate-100 active:bg-slate-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
          '[&>svg]:pointer-events-none',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
