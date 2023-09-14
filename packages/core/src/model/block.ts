import { nanoid } from 'nanoid';

import { Fragment } from './fragment';
import { BlockType, Schema } from './schema';

export class Block {
  constructor(
    readonly type: BlockType,
    readonly props: BlockType['props'],
    readonly children: Fragment,
    readonly id: string = nanoid(10),
  ) {}

  static fromJSON(schema: Schema, json: any): Block {
    if (!json) throw new RangeError('Invalid input for Block.fromJSON');

    const content = Fragment.fromJSON(schema, json.children);

    return schema.blockType(json.type).create(json.props, content);
  }

  toJSON(): any {
    const obj = {
      id: this.id,
      type: this.type.name,
      props: this.props,
      children: this.children.toJSON(),
    };

    return obj;
  }
}
