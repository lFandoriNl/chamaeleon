import { Block } from './types';

export type BlockTag =
  | 'structural'
  | 'rootable'
  | 'nestable'
  | 'clickable'
  | 'content-editing';

type BlockConfig<T> = {
  initial: Omit<Extract<Block, { type: T }>, 'id'>;
  allowedNestedBlocks?: Block['type'][];
  tags: BlockTag[];
};

type BlocksConfig = {
  blocks: {
    [T in Block['type']]: BlockConfig<T>;
  };
};

const settings: BlocksConfig = {
  blocks: {
    row: {
      initial: {
        type: 'row',
        props: {
          children: [],
        },
      },
      allowedNestedBlocks: ['column'],
      tags: ['structural', 'rootable', 'nestable'],
    },
    column: {
      initial: {
        type: 'column',
        props: {
          children: [],
        },
      },
      tags: ['structural', 'nestable'],
    },
    text: {
      initial: {
        type: 'text',
        props: {
          content: '',
        },
      },
      tags: ['content-editing'],
    },
    button: {
      initial: {
        type: 'button',
        props: {
          children: [],
          events: {},
        },
      },
      allowedNestedBlocks: ['text'],
      tags: ['nestable', 'clickable'],
    },
    input: {
      initial: {
        type: 'input',
        props: {},
      },
      tags: [],
    },
  },
};

export function createBlockConfig() {
  const getInitialBlockByType = (type: Block['type']) => {
    return settings.blocks[type].initial;
  };

  const getAllowedRootBlocks = () => {
    return getBlocksByTag('rootable');
  };

  const getAllowedNestedBlocks = (type: Block['type']) => {
    const allowedNestedBlocks = settings.blocks[type].allowedNestedBlocks;
    return allowedNestedBlocks ? allowedNestedBlocks : [];
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
