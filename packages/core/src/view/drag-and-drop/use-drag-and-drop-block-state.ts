import { Block } from '../../model';
import { useEditorInstance } from '../use-editor-instance';

import { useDragAndDropState } from './use-drag-and-drop-state';

export function useDragAndDropBlockState(block: Block) {
  const { view } = useEditorInstance();

  const [isOver] = useDragAndDropState(
    (state) => state.isOverContainerId === block.id,
  );

  const [isDragging] = useDragAndDropState((state) => state.isDragging);

  const [isAvailableDrop] = useDragAndDropState((state) => {
    const activeBlock = state.activeBlock;

    if (!activeBlock) return false;

    const nestedBlocks = activeBlock.getNestedBlocks(view.state.blocks);

    if (nestedBlocks.some((nestedBlock) => nestedBlock.id === block.id)) {
      return false;
    }

    return state.availableDropBlocks.includes(block.type.name);
  });

  return {
    isOver,
    isDragging,
    isAvailableDrop,
  };
}
