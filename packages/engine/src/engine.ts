import { makeAutoObservable, toJS } from 'mobx';
import { nanoid } from 'nanoid';

import { CommandManager, createCommandManager } from './command-manager';
import { blockConfig } from './block-config';

import { createCommandRegistry } from './commands';

import { createListenersRegistry } from './listeners-registry';

import { isNotNullOrUndefined } from './utils';

import { Page, Block, BlockId, EventName, StateContext } from './types';

const commands = createCommandRegistry();
const listenersRegistry = createListenersRegistry();

const initialPage = {
  id: nanoid(10),
  title: 'Enter your page name',
  props: {
    children: null,
  },
};

export class Engine {
  pages: Record<BlockId, Page> = {
    [initialPage.id]: initialPage,
  };
  blocks: Record<BlockId, Block> = {};

  stateHistory: CommandManager<StateContext>;

  currentPageId: BlockId = Object.keys(this.pages)[0]!;

  currentBlockId: BlockId | null = null;

  constructor() {
    makeAutoObservable(this, { stateHistory: false });

    this.stateHistory = createCommandManager<StateContext>({
      pages: this.pages,
      blocks: this.blocks,
    });
  }

  get rootPageBlock() {
    const block = this.pages[this.currentPageId];

    if (!block || !block.props.children) return null;

    return this.blocks[block.props.children];
  }

  get currentBlock() {
    return this.currentBlockId ? this.blocks[this.currentBlockId] : null;
  }

  get pagesArray() {
    return Object.keys(this.pages)
      .map((id) => this.pages[id])
      .filter(isNotNullOrUndefined);
  }

  getBlock<T extends Block>(blockId: BlockId): T {
    return this.blocks[blockId] as T;
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
