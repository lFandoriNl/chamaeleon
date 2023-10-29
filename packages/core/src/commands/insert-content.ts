import { createBlocksFromContent } from '../helpers/create-block-from-content';
import { Block } from '../model';
import { Content, RawCommands } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    insertContent: {
      insertContent: (target: Block['id'], content: Content) => ReturnType;
    };
  }
}

export const insertContent: RawCommands['insertContent'] =
  (target, content) =>
  ({ tr, editor }) => {
    const blocks = createBlocksFromContent(content, editor.schema);

    if (blocks instanceof Block) {
      tr.insertContent(target, [blocks]);
    }
  };
