import { CSS } from '@dnd-kit/utilities';

import { Block } from '../../model';
import { useDraggable as useDndDraggable } from '@dnd-kit/core';

export function useDraggable(block: Block) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform } =
    useDndDraggable({
      id: block.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return {
    drag: setActivatorNodeRef,
    preview: setNodeRef,
    style,
    attributes,
    listeners,
  };
}
