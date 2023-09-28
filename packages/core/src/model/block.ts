import { nanoid } from 'nanoid';

import { Fragment } from './fragment';
import { Props, Style, BlockType, Schema } from './schema';

export class Block {
  private _style: Style;

  constructor(
    readonly type: BlockType,
    readonly props: Props,
    style: Style,
    readonly children: Fragment,
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

  static fromJSON(schema: Schema, json: any): Block {
    if (!json) throw new RangeError('Invalid input for Block.fromJSON');

    const content = Fragment.fromJSON(schema, json.children);
    return schema.blockType(json.type).create(json.props, json.style, content);
  }

  toJSON(): any {
    const obj = {
      id: this.id,
      type: this.type.name,
      props: this.props,
      style: this.style,
      children: this.children.toJSON(),
    };

    return obj;
  }
}
