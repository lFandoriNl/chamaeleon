import { Block } from './types';

export type BlockTag =
  | 'rootable'
  | 'nestable'
  | 'clickable'
  | 'content-editing';

type BlockConfig = {
  blocks: {
    [T in Block['type']]: {
      initial: Omit<Extract<Block, { type: T }>, 'id'>;
      tags: BlockTag[];
    };
  };
};

const settings: BlockConfig = {
  blocks: {
    row: {
      initial: {
        type: 'row',
        props: {
          children: [],
        },
      },
      tags: ['rootable', 'nestable'],
    },
    column: {
      initial: {
        type: 'column',
        props: {
          children: [],
        },
      },
      tags: ['nestable'],
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

  const hasBlockTag = (tag: BlockTag, type: Block['type']) => {
    return settings.blocks[type].tags.includes(tag);
  };

  const getBlocksByTag = (tag: BlockTag) => {
    return (
      Object.keys(settings.blocks) as Array<keyof typeof settings.blocks>
    ).filter((type) => hasBlockTag(tag, type));
  };

  return {
    getInitialBlockByType,
    getBlocksByTag,
    hasBlockTag,
  };
}

export const blockConfig = createBlockConfig();
