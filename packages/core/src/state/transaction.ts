import { Blocks, EditorState } from './editor-state';
import { Transform } from '../transform';
import { Plugin, PluginKey } from './plugin';
import { Block } from '../model';
import { Step } from '../transform/step';

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

  setMeta(key: string | Plugin | PluginKey, value: any): this {
    this.meta[typeof key == 'string' ? key : key.key] = value;

    return this;
  }

  getMeta(key: string | Plugin | PluginKey) {
    return this.meta[typeof key == 'string' ? key : key.key];
  }

  addStep(step: Step, blocks: Blocks) {
    super.addStep(step, blocks);
  }
}
