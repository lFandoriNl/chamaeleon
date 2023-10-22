import { nanoid } from 'nanoid';

import { Blocks } from '../state';
import { Fragment } from './fragment';
import { Props, Style, BlockType, Schema } from './schema';

// FYI: incremental variant for creating id for lightweight debugging

// const ids: Record<string, number> = {};

// function getId(name: string) {
//   if (ids[name] === undefined) {
//     ids[name] = 0;
//     return String(name + '-' + ids[name]++);
//   } else {
//     return String(name + '-' + ids[name]++);
//   }
// }

export class Block {
  private _style: Style;

  constructor(
    readonly type: BlockType,
    readonly props: Props,
    style: Style,
    readonly children: Fragment,
    // readonly id: string = getId(type.name),
    readonly id: string = nanoid(10),
  ) {
    this._style = style;
  }

  get style(): Style {
    return Object.fromEntries(
      Object.entries(this._style).map(([element, cssProperties]) => {
        if (!cssProperties) return [];

        return [
          element,
          Object.fromEntries(
            Object.entries(cssProperties).filter(([_, value]) => {
              if (value === null || value === undefined) {
                return false;
              }

              return true;
            }),
          ),
        ];
      }),
    );
  }

  hasNestedBlock(blockId: Block['id'], blocks: Blocks): boolean {
    const block = blocks[blockId];

    if (!block) return false;

    return block.children.children.some((childId) =>
      this.hasNestedBlock(childId, blocks),
    );
  }

  getNestedBlocks(blocks: Blocks): Block[] {
    const getBlocks = (blockId: Block['id'], blocks: Blocks): Block[] => {
      const block = blocks[blockId];

      return block.children.children
        .map((childId) => getBlocks(childId, blocks))
        .flat()
        .concat(block);
    };

    return getBlocks(this.id, blocks);
  }

  static fromJSON(schema: Schema, json: any): Block {
    if (!json) throw new RangeError('Invalid input for Block.fromJSON');

    const content = Fragment.fromJSON(schema, json.children);

    return schema
      .blockType(json.type)
      .create(json.props, json.style, content, json.id);
  }

  toJSON(): any {
    const obj = {
      id: this.id,
      type: this.type.name,
      props: this.props,
      style: this.style,
      content: this.children.toJSON(),
    };

    return obj;
  }
}
