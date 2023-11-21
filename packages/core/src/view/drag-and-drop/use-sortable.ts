import { useSortable as useDndSortable } from '@dnd-kit/sortable';

import { Block } from '../../model';

export function useSortable(block: Block) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    active,
    over,
  } = useDndSortable({
    id: block.id,
    data: {
      type: 'container',
      items: block.children.children,
    },
  });

  return {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    active,
    over,
  };
}
