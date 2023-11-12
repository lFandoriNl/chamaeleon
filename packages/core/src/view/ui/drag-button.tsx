import { forwardRef } from 'react';

import { MdDragIndicator } from 'react-icons/md';

import { useCombinedRefs } from '@chamaeleon/hooks';

import { ActionButtonProps } from './action-button';
import { type EditorView } from '../editor-view';

export type DragButtonProps = Omit<ActionButtonProps, 'children'> & {
  view: EditorView;
};

export const DragButton = forwardRef<HTMLButtonElement, DragButtonProps>(
  ({ view, ...props }, ref) => {
    const dndConnector = view.dragAndDrop.useDndConnector();

    if (dndConnector.withActivator) {
      return (
        <button
          {...props}
          ref={useCombinedRefs<HTMLButtonElement>(ref, dndConnector.ref)}
          className="relative -top-1 cursor-grab rounded bg-slate-400"
          {...dndConnector.attributes}
          {...dndConnector.listeners}
        >
          <MdDragIndicator size={20} color="#fff" />
        </button>
      );
    }

    return null;
  },
);

DragButton.displayName = 'DragButton';
