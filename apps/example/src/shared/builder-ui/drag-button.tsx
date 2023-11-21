import { useEditor } from '@chamaeleon/react-editor';
import { ActionIcon, ActionIconProps, ElementProps } from '@mantine/core';
import { forwardRef } from 'react';
import { MdDragIndicator } from 'react-icons/md';

import { useCombinedRefs } from '../hooks/use-combined-refs';

export type DragButtonProps = ActionIconProps &
  ElementProps<'button', keyof ActionIconProps>;

export const DragButton = forwardRef<HTMLButtonElement, DragButtonProps>(
  (props, ref) => {
    const editor = useEditor();

    const dndConnector = editor.view.dragAndDrop.useDndConnector();

    if (dndConnector.withActivator) {
      return (
        <ActionIcon
          className="relative -top-1 cursor-grab rounded border-none bg-slate-400"
          size="sm"
          variant="outline"
          aria-label="Drag block"
          {...props}
          ref={useCombinedRefs<HTMLButtonElement>(ref, dndConnector.ref)}
          {...dndConnector.attributes}
          {...dndConnector.listeners}
        >
          <MdDragIndicator size={20} color="#fff" />
        </ActionIcon>
      );
    }

    return null;
  },
);

DragButton.displayName = 'DragButton';
