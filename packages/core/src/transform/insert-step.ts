import { applyPatches } from 'immer';
import { Blocks } from '../state';
import { Step, StepResult } from './step';
import { Block } from '../model';

export class InsertStep extends Step {
  constructor(
    private target: Block['id'],
    private block: Block,
  ) {
    super();
  }

  apply(blocks: Blocks) {
    const newBlocks = this.produceWithPatches(blocks, (draft) => {
      if (draft[this.target]) {
        draft[this.block.id] = this.block;

        draft[this.target] = draft[this.target].type.create(
          draft[this.target].props,
          draft[this.target].style,
          draft[this.target].children.extend(this.block),
          draft[this.target].id,
        );

        this.meta.changedParent = this.target;
      } else {
        draft[this.target] = this.block;
      }

      this.meta.changed = this.block.id;
    });

    return StepResult.ok(newBlocks);
  }

  invert(blocks: Blocks) {
    return StepResult.ok(applyPatches(blocks, this.inversePatches));
  }
}
