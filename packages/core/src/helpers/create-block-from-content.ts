import { Block } from '../model/block';
import { Fragment } from '../model/fragment';
import { Schema } from '../model/schema';

import { Content } from '../types';

export function createBlocksFromContent(
  content: Content,
  schema: Schema,
): Block | Fragment {
  if (Array.isArray(content) && content.length > 0) {
    return Fragment.from(content.map((item) => schema.blockFromJSON(item)));
  }

  return schema.blockFromJSON(content);
}
