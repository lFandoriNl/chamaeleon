import { createBlocksFromContent } from '../helpers/create-block-from-content';
import { Block } from '../model';
import { JSONContent, RawCommands } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    insertRootContent: {
      insertRootContent: (content: JSONContent & { id: string }) => ReturnType;
    };
  }
}

export const insertRootContent: RawCommands['insertRootContent'] =
  (content) =>
  ({ tr, editor }) => {
    const block = createBlocksFromContent(content, editor.schema);

    if (block instanceof Block) {
      tr.insertContent(block.id, [block]);
    }
  };
