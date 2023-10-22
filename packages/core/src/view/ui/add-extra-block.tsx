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
>(({ className, children, onClick, view: _, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={clsx(
        'min-h-[64px] rounded-xl border p-4',
        'bg-white hover:bg-slate-100 focus:relative focus:outline-none focus:ring focus:ring-blue-600 active:bg-slate-200',
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
