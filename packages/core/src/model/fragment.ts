import { Block } from './block';
import { Schema } from './schema';

export class Fragment {
  constructor(readonly children: Block['id'][]) {}

  get isEmpty() {
    return this.children.length === 0;
  }

  remove(ids: Array<Block['id']>) {
    return new Fragment(this.children.filter((id) => !ids.includes(id)));
  }

  extend(block: Block) {
    return new Fragment([...this.children, block.id]);
  }

  static from(blocks?: Fragment | Block | readonly Block[] | null) {
    if (!blocks) return Fragment.empty;

    if (blocks instanceof Fragment) return blocks;

    if (Array.isArray(blocks))
      return new Fragment(blocks.map((block) => block.id));

    if (blocks as Block) return new Fragment([(blocks as Block).id]);

    throw new RangeError(`Can not convert ${blocks} to a Fragment.`);
  }

  static fromJSON(schema: Schema, value: any) {
    if (!value) return Fragment.empty;

    if (!Array.isArray(value))
      throw new RangeError('Invalid input for Fragment.fromJSON');

    return new Fragment(value);
  }

  static empty = new Fragment([]);

  toJSON(): any {
    return this.children;
  }
}
