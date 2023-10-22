import { Block } from './block';
import { Schema } from './schema';

export class Fragment {
  constructor(readonly children: Block['id'][]) {}

  get isEmpty() {
    return this.children.length === 0;
  }

  get isNotEmpty() {
    return this.children.length !== 0;
  }

  has(id: Block['id'] | Block) {
    return this.children.includes(typeof id === 'string' ? id : id.id);
  }

  indexOf(id: Block['id'] | Block, fromIndex?: number) {
    return this.children.indexOf(
      typeof id === 'string' ? id : id.id,
      fromIndex,
    );
  }

  remove(ids: Array<Block['id'] | number>) {
    return new Fragment(
      this.children.filter((id, index) => {
        return ids.every((idOrIndex) => {
          if (typeof idOrIndex === 'number') {
            return index !== idOrIndex;
          } else {
            return id !== idOrIndex;
          }
        });
      }),
    );
  }

  move(from: number, to: number) {
    const newChildren = this.children.slice();

    newChildren.splice(
      to < 0 ? newChildren.length + to : to,
      0,
      newChildren.splice(from, 1)[0],
    );

    return new Fragment(newChildren);
  }

  swap(from: number, to: number) {
    const newChildren = this.children.slice();

    [newChildren[to], newChildren[from]] = [newChildren[from], newChildren[to]];

    return new Fragment(newChildren);
  }

  insert(block: Block, index: number) {
    return new Fragment([
      ...this.children.slice(0, index),
      block.id,
      ...this.children.slice(index),
    ]);
  }

  append(block: Block) {
    return new Fragment([...this.children, block.id]);
  }

  static from(blocks?: Fragment | Block | Block[] | Block['id'][] | null) {
    if (!blocks) return Fragment.empty;

    if (blocks instanceof Fragment) return blocks;

    if (Array.isArray(blocks)) {
      return new Fragment(
        blocks.map((block) => {
          if (block instanceof Block) {
            return block.id;
          }

          return block;
        }),
      );
    }

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
