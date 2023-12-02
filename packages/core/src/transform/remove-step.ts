import { applyPatches } from 'immer';

import { Block } from '../model';
import { Blocks } from '../state';
import { Step, StepResult } from './step';

function removeTreeBlocks(blocks: Blocks, id: Block['id']) {
  if (blocks[id]) {
    blocks[id].children.children.forEach((blockId) => {
      if (blocks[blockId]) {
        return removeTreeBlocks(blocks, blockId);
      }
    });
  }

  delete blocks[id];
}

export class RemoveStep extends Step {
  constructor(
    private target: Block['id'],
    private blockIds?: Array<Block['id']>,
  ) {
    super();
  }

  apply(blocks: Blocks) {
    const newBlocks = this.produceWithPatches(blocks, (draft) => {
      if (this.blockIds) {
        draft[this.target] = draft[this.target].type.create(
          draft[this.target].props,
          draft[this.target].style,
          draft[this.target].children.remove(this.blockIds),
          draft[this.target].id,
        );

        this.blockIds.forEach((id) => {
          removeTreeBlocks(draft, id);
        });
      } else {
        removeTreeBlocks(draft, this.target);

        delete draft[this.target];

        Object.entries(draft).forEach(([id, block]) => {
          if (block.children.has(this.target)) {
            draft[id] = block.type.create(
              block.props,
              block.style,
              block.children.remove([this.target]),
              block.id,
            );
          }
        });
      }
    });

    return StepResult.ok(newBlocks);
  }

  invert(blocks: Blocks) {
    return StepResult.ok(applyPatches(blocks, this.inversePatches));
  }
}
