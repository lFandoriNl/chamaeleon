import { Blocks, EditorState } from './editor-state';
import { Transform } from '../transform';
import { Plugin, PluginKey } from './plugin';
import { Step } from '../transform/step';

export class Transaction extends Transform {
  activeId: EditorState['activeId'];

  private meta: { [name: string]: any } = {};

  constructor(private state: EditorState) {
    super(state.blocks, state.lastModifiedBlock);

    this.activeId = state.activeId;
  }

  get activeBlock() {
    if (!this.activeId) return null;

    return this.blocks[this.activeId];
  }

  select() {
    if (this.lastModifiedBlock) {
      this.activeId = this.lastModifiedBlock;
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

  log() {
    const { activeId, lastModifiedBlock, blocks } = this;

    console.dir(
      { activeId, lastModifiedBlock, blocks },
      {
        depth: Infinity,
      },
    );
  }
}
