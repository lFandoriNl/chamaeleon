import { createNodeFromContent } from '../helpers/create-block-from-content';
import { Block } from '../model/block';
import { Content, RawCommands } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    insertContent: {
      insertContent: (
        target: Block['id'] | null,
        content: Content,
      ) => ReturnType;
    };
  }
}

export const insertContent: RawCommands['insertContent'] =
  (target, value) =>
  ({ tr, editor }) => {
    const content = createNodeFromContent(value, editor.schema);

    tr.insertContent(target, content);
  };
