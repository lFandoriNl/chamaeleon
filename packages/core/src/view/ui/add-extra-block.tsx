import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';

import { EditorView } from '../editor-view';

export type AddExtraBlockProps = HTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
} & {
  view: EditorView;
};

export const AddExtraBlock = React.forwardRef<
  HTMLButtonElement,
  AddExtraBlockProps
>(({ className, children, onClick, view, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={clsx(
        'min-h-[64px] p-4 border rounded-xl',
        'bg-white hover:bg-slate-100 active:bg-slate-200 focus:outline-none focus:relative focus:ring focus:ring-blue-600',
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children || 'Add extra block'}
    </button>
  );
});

AddExtraBlock.displayName = 'AddExtraBlock';
