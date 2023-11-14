import { CSSProperties } from 'react';

import { Block } from './block';
import { Fragment } from './fragment';
import { mergeDeep } from '../utilities/merge-deep';

export type Props = {
  readonly [prop: string]: any;
};

function defaultProps(props: Props) {
  const defaults: Record<string, any> = {};

  for (const propName in props) {
    const prop = props[propName];

    if (!prop.hasDefault) return null;

    defaults[propName] = prop.default;
  }

  return defaults;
}

function computeProps(props: Props, value: Props | null) {
  const built: Record<string, any> = {};

  for (const name in props) {
    let given = value && value[name];

    if (given === undefined) {
      const prop = props[name];
      if (prop.hasDefault) {
        given = prop.default;
      } else {
        throw new RangeError('No value supplied for prop ' + name);
      }
    }

    built[name] = given;
  }

  return built;
}

function initProps(props: BlockSpec['props']) {
  const result: BlockType['props'] = {};

  if (props) {
    for (const name in props) {
      result[name] = new Property(props[name]);
    }
  }

  return result;
}

export interface PropertySpec {
  default?: any;
}

class Property {
  hasDefault: boolean;
  default: any;

  constructor(options: PropertySpec) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(options, 'default');
    this.default = options.default;
  }

  get isRequired() {
    return !this.hasDefault;
  }
}

export type Style = Partial<{
  readonly root: Partial<CSSProperties>;
  readonly [element: string]: Partial<CSSProperties>;
}>;

// Helper type for getting [element: 'root' | string] keys
type Elements = {
  readonly root: any;
  readonly [element: string]: any;
};

export interface BlockSpec {
  allowContent?: {
    name?: Array<'*' | Block['type']['name'] | `!${Block['type']['name']}`>;
    withValue?: boolean;
    withChildren?: boolean;
    rootable?: boolean;
    structural?: boolean;
  };

  props?: { [name: string]: PropertySpec };
  style?: {
    [element in keyof Elements]: {
      [name in keyof CSSProperties]: CSSProperties[name];
    };
  };

  withValue?: boolean;
  withChildren?: boolean;
  rootable?: boolean;
  structural?: boolean;
}

export class BlockType {
  props: { [name: string]: Property };
  defaultProps: Props | null;

  style: {
    [element in keyof Elements]: {
      [name in keyof CSSProperties]: CSSProperties[name];
    };
  };

  constructor(
    readonly name: string,
    readonly schema: Schema,
    readonly spec: BlockSpec,
  ) {
    this.props = initProps(spec.props);
    this.defaultProps = defaultProps(this.props);

    this.style = spec.style || { root: {} };
  }

  computeProps(props: Props | null): Props {
    if (!props && this.defaultProps) {
      return this.defaultProps;
    }

    return computeProps(this.props, props);
  }

  computeStyle(style: Style | null) {
    if (!style) {
      return {};
    }
  }

  create(
    props: Props | null = null,
    style: Style | null = null,
    content?: Fragment | Block | Block[] | null,
    id?: Block['id'],
  ) {
    return new Block(
      this,
      this.computeProps(props),
      mergeDeep(this.style, style || {}),
      Fragment.from(content),
      id,
    );
  }

  isAllowedContent(block: Block) {
    return this.schema
      .getAllowContent(this.spec.allowContent)
      .some((blockType) => blockType.name === block.type.name);
  }

  validContent(_content: Fragment) {
    // TODO:
    return true;
  }

  checkContent(content: Fragment) {
    if (!this.validContent(content))
      throw new RangeError(`Invalid content for block: ${this.name}`);
  }

  static compile<Blocks extends string>(
    blocks: Map<Blocks, BlockSpec>,
    schema: Schema<Blocks>,
  ): { readonly [name in Blocks]: BlockType } {
    const result = {} as Record<Blocks, BlockType>;

    blocks.forEach((spec, name) => {
      result[name] = new BlockType(name, schema, spec);
    });

    return result;
  }
}

export interface SchemaSpec<Blocks extends string = any> {
  rootBlockId?: string;
  blocks: { [name in Blocks]: BlockSpec } | Map<Blocks, BlockSpec>;
}

export class Schema<Blocks extends string = any> {
  spec: {
    rootBlockId: string;
    blocks: Map<Blocks, BlockSpec>;
  };

  blocks: { readonly [name in Blocks]: BlockType } & {
    readonly [key: string]: BlockType;
  };

  constructor(spec: SchemaSpec<Blocks>) {
    const instanceSpec = (this.spec = {} as any);

    for (const prop in spec) {
      instanceSpec[prop] = (spec as any)[prop];
    }

    if (!instanceSpec.rootBlockId) {
      instanceSpec.rootBlockId = 'root';
    }

    instanceSpec.blocks = new Map(Object.entries(spec.blocks));

    this.blocks = BlockType.compile(this.spec.blocks, this);
  }

  block(
    type: BlockType | string,
    props: Props | null = null,
    style: Style | null = null,
    content?: Fragment | Block | Block[],
    id?: Block['id'],
  ) {
    if (typeof type == 'string') {
      type = this.blockType(type);
    } else if (!(type instanceof BlockType)) {
      throw new RangeError('Invalid block type: ' + type);
    } else if (type.schema != this) {
      throw new RangeError(
        `Block type from different schema used (${type.name})`,
      );
    }

    return type.create(props, style, content, id);
  }

  blockType(name: string) {
    const found = this.blocks[name];

    if (!found) throw new Error('Unknown block type: ' + name);

    return found;
  }

  getAllowContentAsChildren(block: Block) {
    return Object.values(this.blocks).filter((blockType) => {
      const allowContent = this.getAllowContent(blockType.spec.allowContent);

      return allowContent.some((b) => b.name === block.type.name);
    });
  }

  getAllowContent(value: Block | BlockSpec['allowContent']) {
    const allowContent =
      (value instanceof Block ? value.type.spec.allowContent : value) || {};

    const nameAllowed = allowContent.name
      ? allowContent.name.filter((b) => !b.startsWith('!'))
      : [];

    const nameNotAllowed = allowContent.name
      ? allowContent.name
          .filter((b) => b.startsWith('!'))
          .map((b) => b.slice(1))
      : [];

    return Object.values(this.blocks).filter((blockType) => {
      if (
        allowContent.name &&
        nameNotAllowed.includes(blockType.name) === false
      ) {
        if (nameAllowed.includes('*') || nameAllowed.includes(blockType.name)) {
          return true;
        }
      }

      if (
        allowContent.withValue &&
        allowContent.withValue === blockType.spec.withValue
      ) {
        return true;
      }

      if (
        allowContent.withChildren &&
        allowContent.withChildren === blockType.spec.withChildren
      ) {
        return true;
      }

      if (
        allowContent.rootable &&
        allowContent.rootable === blockType.spec.rootable
      ) {
        return true;
      }

      if (
        allowContent.structural &&
        allowContent.structural === blockType.spec.structural
      ) {
        return true;
      }

      return false;
    });
  }

  blockFromJSON(json: any): Block {
    return Block.fromJSON(this, json);
  }
}
