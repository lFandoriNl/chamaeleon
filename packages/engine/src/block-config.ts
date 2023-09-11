import { Block } from './types';

export type BlockTag =
  | 'rootable'
  | 'structural'
  | 'nestable'
  | 'clickable'
  | 'content-editing';

type Property = {
  type: 'children';
};

type BlockSetting<T> = {
  initial: Omit<Extract<Block, { type: T }>, 'id'>;
  allowedNestedBlocks?: {
    byType?: Block['type'][];
    byTag?: BlockTag[];
  };
  tags: BlockTag[];
  properties: {
    configurable: Property[];
  };
};

type BlocksSettings = {
  properties: Record<Property['type'], Property>;
  blocks: {
    [T in Block['type']]: BlockSetting<T>;
  };
};

const settings: BlocksSettings = {
  properties: {
    children: {
      type: 'children',
    },
  },
  blocks: {
    row: {
      initial: {
        type: 'row',
        props: {
          children: [],
        },
      },
      allowedNestedBlocks: {
        byType: ['column'],
      },
      tags: ['rootable', 'structural', 'nestable'],
      properties: {
        configurable: [
          {
            type: 'children',
          },
        ],
      },
    },
    column: {
      initial: {
        type: 'column',
        props: {
          children: [],
        },
      },
      allowedNestedBlocks: {
        byTag: ['structural', 'nestable', 'content-editing'],
      },
      tags: ['structural', 'nestable'],
      properties: {
        configurable: [
          {
            type: 'children',
          },
        ],
      },
    },
    text: {
      initial: {
        type: 'text',
        props: {
          content: 'Text',
        },
      },
      tags: ['content-editing'],
      properties: {
        configurable: [],
      },
    },
    button: {
      initial: {
        type: 'button',
        props: {
          children: [],
          events: {},
        },
      },
      allowedNestedBlocks: {
        byType: ['text'],
      },
      tags: ['nestable', 'clickable'],
      properties: {
        configurable: [
          {
            type: 'children',
          },
        ],
      },
    },
    input: {
      initial: {
        type: 'input',
        props: {},
      },
      tags: [],
      properties: {
        configurable: [],
      },
    },
  },
};

export type BlockConfig = ReturnType<typeof createBlockConfig>;

function createBlockConfig() {
  const getInitialBlockByType = (type: Block['type']) => {
    return settings.blocks[type].initial;
  };

  const getAllowedRootBlocks = () => {
    return getBlocksByTag('rootable');
  };

  const getAllowedNestedBlocks = (type: Block['type']) => {
    const allowedNestedBlocks = settings.blocks[type].allowedNestedBlocks;

    if (!allowedNestedBlocks) return [];

    const blocks = Object.keys(settings.blocks) as Block['type'][];

    return blocks.filter((block) => {
      return (
        allowedNestedBlocks.byType?.includes(block) ||
        allowedNestedBlocks.byTag?.some((tag) =>
          settings.blocks[block].tags.includes(tag),
        )
      );
    });
  };

  const getBlocksByTag = (tag: BlockTag) => {
    return (
      Object.keys(settings.blocks) as Array<keyof typeof settings.blocks>
    ).filter((type) => hasBlockTag(tag, type));
  };

  const hasBlockTag = (tag: BlockTag, type: Block['type']) => {
    return settings.blocks[type].tags.includes(tag);
  };

  return {
    getInitialBlockByType,
    getAllowedRootBlocks,
    getAllowedNestedBlocks,
    getBlocksByTag,
    hasBlockTag,
  };
}

export const blockConfig = createBlockConfig();
