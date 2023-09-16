import { applyPatches } from 'immer';
import { Blocks } from '../state';
import { Step, StepResult } from './step';
import { Block, Fragment } from '../model';

export class InsertStep extends Step {
  constructor(
    private target: Block['id'] | null,
    private block: Block,
  ) {
    super();
  }

  apply(blocks: Blocks) {
    const newBlocks = this.produceWithPatches(blocks, (draft) => {
      if (this.target) {
        draft[this.block.id] = this.block;

        draft[this.target] = draft[this.target].type.create(
          draft[this.target].props,
          draft[this.target].children.extend(this.block),
        );
      } else {
        draft[this.block.id] = this.block;
      }
    });

    return StepResult.ok(newBlocks);
  }

  invert(blocks: Blocks) {
    return StepResult.ok(applyPatches(blocks, this.inversePatches));
  }
}
