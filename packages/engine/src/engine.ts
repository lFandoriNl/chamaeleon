import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';

import { CommandManager, createCommandManager } from './command-manager';
import { createBlockConfig } from './block-config';

import { commands } from './commands';

import { Page, Block, BlockId } from './types';

const blockConfig = createBlockConfig();

const initialPage = {
  id: nanoid(10),
  title: 'Enter your page name',
  props: {
    children: '',
  },
};

export class Engine {
  pages: Record<BlockId, Page> = {
    [initialPage.id]: initialPage,
  };
  pagesHistory: CommandManager<Record<BlockId, Page>>;

  blocks: Record<BlockId, Block> = {};
  blocksHistory: CommandManager<Record<BlockId, Block>>;

  currentPageId: BlockId = Object.keys(this.pages)[0];

  constructor() {
    makeAutoObservable(this, { pagesHistory: false, blocksHistory: false });

    this.pagesHistory = createCommandManager(this.pages);
    this.blocksHistory = createCommandManager<Record<BlockId, Block>>(
      this.blocks,
    );
  }

  addRootPageBlock(type: Block['type']) {
    const initialBlock = blockConfig.getInitialBlockByType(type);

    const block = {
      id: nanoid(10),
      ...initialBlock,
    };

    this.blocksHistory.execute(commands.createAddPageRootBlockCommand(block));

    this.pagesHistory.execute(
      commands.createSetPageRootBlockCommand(block, this.currentPageId),
    );
  }

  addBlock(type: Block['type'], to: BlockId) {
    const initialBlock = blockConfig.getInitialBlockByType(type);

    this.blocksHistory.execute(
      commands.createAddBlockCommand(
        {
          id: nanoid(10),
          ...initialBlock,
        },
        to,
      ),
    );
  }
}
