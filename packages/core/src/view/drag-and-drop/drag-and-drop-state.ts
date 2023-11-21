import { EventEmitter } from '../../event-emitter';
import { Block } from '../../model';

export class DragAndDropState extends EventEmitter<{
  update: DragAndDropState;
}> {
  constructor() {
    super();
  }

  activeBlock: Block | null = null;

  isOverContainerId: Block['id'] | null = null;

  availableDropBlocks: Block['type']['name'][] = [];

  get isDragging() {
    return Boolean(this.activeBlock);
  }

  changeOverContainerId(id: Block['id'] | null) {
    if (this.isOverContainerId === id) return;

    this.isOverContainerId = id;

    this.emit('update', this);
  }

  changeAvailableDropBlocks(blockNames: Block['type']['name'][]) {
    this.availableDropBlocks = blockNames;

    this.emit('update', this);
  }

  changeActiveBlock(block: Block) {
    this.activeBlock = block;

    this.emit('update', this);
  }

  resetActiveBlock() {
    this.activeBlock = null;
    this.isOverContainerId = null;
    this.availableDropBlocks = [];

    this.emit('update', this);
  }
}
