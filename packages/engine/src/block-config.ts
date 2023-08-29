import { Block } from './types';

type ObjectTypeMap<T extends string> = {
  [K in Block['type']]: Omit<Extract<Block, { type: K }>, T>;
};

type BlockConfig = {
  initialBlocks: ObjectTypeMap<'id'>;
};

const settings: BlockConfig = {
  initialBlocks: {
    row: {
      type: 'row',
      props: {
        children: [],
      },
    },
    column: {
      type: 'column',
      props: {
        children: [],
      },
    },
    text: {
      type: 'text',
      props: {
        content: '',
      },
    },
    button: {
      type: 'button',
      props: {
        children: [],
      },
    },
    input: {
      type: 'input',
      props: {},
    },
  },
};

export function createBlockConfig() {
  const getInitialBlockByType = (type: Block['type']) => {
    return settings.initialBlocks[type];
  };

  return { getInitialBlockByType };
}
