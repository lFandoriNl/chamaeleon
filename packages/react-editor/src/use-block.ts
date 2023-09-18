import { Block } from '@chameleon/core';

import { useEditorSelector } from './use-editor-subscribe';

export const useBlock = (block: Block) => {
  return useEditorSelector(({ editor }) => editor.state.getBlock(block.id));
};
