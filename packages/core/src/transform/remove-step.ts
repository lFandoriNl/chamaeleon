import { applyPatches } from 'immer';

import { Block, Fragment } from '../model';
import { Blocks } from '../state';
import { Step, StepResult } from './step';

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
          delete draft[id];
        });
      } else {
        const content = draft[this.target].children;

        if (content.isEmpty) return;

        draft[this.target] = draft[this.target].type.create(
          draft[this.target].props,
          draft[this.target].style,
          Fragment.empty,
          draft[this.target].id,
        );

        content.children.forEach((id) => {
          delete draft[id];
        });
      }
    });

    return StepResult.ok(newBlocks);
  }

  invert(blocks: Blocks) {
    return StepResult.ok(applyPatches(blocks, this.inversePatches));
  }
}
