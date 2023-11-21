import { Block } from '../model';
import { Transform } from '../transform';
import { Step } from '../transform/step';
import { Blocks, EditorState } from './editor-state';
import { Plugin } from './plugin';

export class Transaction extends Transform {
  activeId: EditorState['activeId'];

  private meta: { [name: string]: any } = {};

  constructor(state: EditorState) {
    super(state.blocks, state.lastModifiedBlock);

    this.activeId = state.activeId;
  }

  get activeBlock() {
    if (!this.activeId) return null;

    return this.blocks[this.activeId];
  }

  select(target?: Block['id'] | null) {
    if (target) {
      this.activeId = target;

      return this;
    }

    if (this.lastModifiedBlock) {
      this.activeId = target || this.lastModifiedBlock;
    }

    return this;
  }

  setMeta(key: string | Plugin, value: any): this {
    this.meta[typeof key == 'string' ? key : key.name] = value;

    return this;
  }

  getMeta(key: string | Plugin) {
    return this.meta[typeof key == 'string' ? key : key.name];
  }

  addStep(step: Step, blocks: Blocks) {
    super.addStep(step, blocks);
  }
}
