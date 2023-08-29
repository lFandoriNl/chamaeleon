import { makeAutoObservable, toJS } from 'mobx';
import { nanoid } from 'nanoid';

import { CommandManager, createCommandManager } from './command-manager';
import { blockConfig } from './block-config';

import { commands } from './commands';

import { Page, Block, BlockId, EventName } from './types';
import { listenersRegistry } from './listeners-registry';

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

  currentBlockId: BlockId | null = null;

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

    this.currentBlockId = block.id;

    return block;
  }

  addBlock(type: Block['type'], target: BlockId) {
    const initialBlock = blockConfig.getInitialBlockByType(type);

    const block = {
      id: nanoid(10),
      ...initialBlock,
    };

    this.blocksHistory.execute(commands.createAddBlockCommand(block, target));

    this.currentBlockId = block.id;

    return block;
  }

  changeContent(target: BlockId, content: string) {
    this.blocksHistory.execute(
      commands.createChangeContentCommand(target, content),
    );

    this.currentBlockId = target;
  }

  addEventListener(target: BlockId, eventName: EventName, actionRaw: string) {
    const listenerId = listenersRegistry.set(target, eventName, actionRaw);

    this.blocksHistory.execute(
      commands.createAddEventListenerCommand(target, eventName, listenerId),
    );
  }

  executeEvent(listenerId: string) {}

  debugFull() {
    console.dir(
      {
        pages: toJS(this.pages),
        blocks: toJS(this.blocks),
      },
      { depth: Infinity },
    );
  }

  debugBlocks() {
    console.dir(toJS(this.blocks), { depth: Infinity });
  }
}
