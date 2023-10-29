import { applyPatches } from 'immer';
import { Blocks } from '../state';
import { Step, StepResult } from './step';
import { Block } from '../model';

export class InsertStep extends Step {
  constructor(
    private target: Block['id'],
    private blocks: Array<Block | Block['id']>,
  ) {
    super();
  }

  apply(blocks: Blocks) {
    const newBlocks = this.produceWithPatches(blocks, (draft) => {
      const paramBlocks = this.blocks.map((block) =>
        typeof block === 'string' ? draft[block] : block,
      );

      if (draft[this.target]) {
        paramBlocks.forEach((block) => {
          draft[block.id] = block;
        });

        draft[this.target] = draft[this.target].type.create(
          draft[this.target].props,
          draft[this.target].style,
          draft[this.target].children.append(paramBlocks),
          draft[this.target].id,
        );
      } else {
        draft[this.target] = paramBlocks[0];
      }

      this.meta.changedParent = this.target;

      this.meta.changed = paramBlocks[paramBlocks.length - 1].id;
    });

    return StepResult.ok(newBlocks);
  }

  invert(blocks: Blocks) {
    return StepResult.ok(applyPatches(blocks, this.inversePatches));
  }
}
