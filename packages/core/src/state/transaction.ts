import { EditorState } from './editor-state';
import { Transform } from './transform';
import { Block } from '../model/block';
import { Fragment } from '../model/fragment';
import { Plugin, PluginKey } from './plugin';

export class Transaction extends Transform {
  activeId: EditorState['activeId'];
  lastModifiedBlock: EditorState['lastModifiedBlock'];

  private meta: { [name: string]: any } = Object.create(null);

  constructor(private state: EditorState) {
    super(state.blocks);

    this.activeId = state.activeId;
    this.lastModifiedBlock = state.lastModifiedBlock;
  }

  get activeBlock() {
    if (!this.activeId) return null;

    return this.blocks[this.activeId];
  }

  insertContent(target: Block['id'] | null, block: Block | Fragment): this {
    if (block instanceof Block) {
      this.blocks[target || block.id] = block;

      this.lastModifiedBlock = block.id;
    } else {
      // this.blocks[target || 'root'] = Fragment.from(newBlock.children);
    }

    return this;
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

  log() {
    console.log('Transaction');

    const { activeId, blocks } = this;

    console.dir(
      { activeId, blocks },
      {
        depth: Infinity,
      },
    );
  }
}
