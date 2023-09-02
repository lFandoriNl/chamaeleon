import { makeAutoObservable, toJS } from 'mobx';
import { nanoid } from 'nanoid';

import { CommandManager, createCommandManager } from './command-manager';
import { blockConfig } from './block-config';

import { createCommandRegistry } from './commands';

import { Page, Block, BlockId, EventName, StateContext } from './types';
import { createListenersRegistry } from './listeners-registry';

const commands = createCommandRegistry();
const listenersRegistry = createListenersRegistry();

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
  blocks: Record<BlockId, Block> = {};

  stateHistory: CommandManager<StateContext>;

  currentPageId: BlockId = Object.keys(this.pages)[0];

  currentBlockId: BlockId | null = null;

  constructor() {
    makeAutoObservable(this, { stateHistory: false });

    this.stateHistory = createCommandManager<StateContext>({
      pages: this.pages,
      blocks: this.blocks,
    });
  }

  get currentBlock() {
    return this.currentBlockId ? this.blocks[this.currentBlockId] : null;
  }

  get pagesArray() {
    return Object.keys(this.pages).map((id) => this.pages[id]);
  }

  getBlock(blockId: BlockId) {
    return this.blocks[blockId];
  }

  addRootPageBlock(type: Block['type']) {
    const initialBlock = blockConfig.getInitialBlockByType(type);

    const block = {
      id: nanoid(10),
      ...initialBlock,
    };

    this.stateHistory.execute(
      commands.createAddPageRootBlockCommand(this.currentPageId, block),
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

    this.stateHistory.execute(commands.createAddBlockCommand(target, block));

    this.currentBlockId = block.id;

    return block;
  }

  changeContent(target: BlockId, content: string) {
    this.stateHistory.execute(
      commands.createChangeContentCommand(target, content),
    );

    this.currentBlockId = target;
  }

  addEventListener(target: BlockId, eventName: EventName, actionRaw: string) {
    const listenerId = listenersRegistry.set(target, eventName, actionRaw);

    this.stateHistory.execute(
      commands.createAddEventListenerCommand(target, eventName, listenerId),
    );
  }

  executeEvent(listenerId: string) {
    return listenerId;
  }

  redo() {
    this.stateHistory.redo();
  }

  undo() {
    this.stateHistory.undo();
  }

  getSnapshot() {
    return {
      pages: toJS(this.pages),
      blocks: toJS(this.blocks),
    };
  }

  debugFull() {
    console.dir(this.getSnapshot(), { depth: Infinity });
  }

  debugBlocks() {
    console.dir(this.getSnapshot().blocks, { depth: Infinity });
  }
}
