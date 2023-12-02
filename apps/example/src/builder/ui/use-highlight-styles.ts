import { Block } from '@chamaeleon/core';
import { useEditor } from '@chamaeleon/react-editor';

export function useHighlightStyles(block: Block) {
  const { view } = useEditor();

  const { isOver, isAvailableDrop } = view.dragAndDrop.useBlockState(block);

  return {
    ...(isAvailableDrop && {
      outline: '2px solid limegreen',
    }),
    ...(isOver && {
      outline: '2px solid blue',
    }),
    '&:hover': {
      outline: '2px solid blue',
    },
  };
}
