import clsx from 'clsx';
import React, { HTMLAttributes, forwardRef } from 'react';

export type PanelButtonProps = HTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const PanelButton = forwardRef<HTMLButtonElement, PanelButtonProps>(
  ({ className, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'ui-panel-button',
          'h-16 py-4 px-6 rounded-xl text-base',
          'bg-opacity-50 bg-slate-300 hover:bg-slate-300 active:bg-slate-400',
          'focus:outline-none focus:relative focus:ring focus:ring-blue-600',
          className,
        )}
        onClick={onClick}
        {...props}
      >
        {props.children}
      </button>
    );
  },
);
