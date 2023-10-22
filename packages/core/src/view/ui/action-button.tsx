import { forwardRef } from 'react';
import clsx from 'clsx';

import { IconButton, IconButtonProps } from '@chamaeleon/uikit';

import { EditorView } from '../editor-view';

export type ActionButtonProps = IconButtonProps & {
  view: EditorView;
};

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ view: _, ...props }, ref) => {
    return (
      <IconButton
        {...props}
        ref={ref}
        className={clsx(props.className, 'rounded-lg')}
      />
    );
  },
);

ActionButton.displayName = 'ActionButton';
