import { Block } from '@chameleon/core';

import { useEditorSelector } from './use-editor-selector';

export const useBlock = (block: Block) => {
  return useEditorSelector(({ editor }) => {
    try {
      return editor.state.getBlock(block.id);
    } catch {
      return block;
    }
  })[0];
};
