import React, { HTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

import { EditorView } from '../editor-view';

export type PanelButtonProps = HTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & {
  view: EditorView;
};

export const PanelButton = forwardRef<HTMLButtonElement, PanelButtonProps>(
  ({ className, onClick, view: _, ...props }, ref) => {
    return (
      <button
        className={clsx(
          'ui-panel-button',
          'h-16 rounded-xl px-6 py-4 text-base',
          'bg-slate-200',
          'focus:relative focus:outline-none focus:ring focus:ring-blue-600',
          className,
        )}
        onClick={onClick}
        {...props}
        ref={ref}
      >
        {props.children}
      </button>
    );
  },
);

PanelButton.displayName = 'PanelButton';
