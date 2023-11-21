import { applyPatches } from 'immer';

import { Block } from '../model';
import { Blocks } from '../state';
import { Step, StepResult } from './step';

export class MoveStep extends Step {
  constructor(
    private source: Block['id'],
    private target: Block['id'],
    private from: number,
    private to: number,
  ) {
    super();
  }

  apply(blocks: Blocks) {
    if (!blocks[this.target])
      return StepResult.fail('There is no block with this id' + this.target);

    const newBlocks = this.produceWithPatches(blocks, (draft) => {
      if (this.source === this.target) {
        const blockTarget = draft[this.target];

        draft[this.target] = blockTarget.type.create(
          blockTarget.props,
          blockTarget.style,
          blockTarget.children.move(this.from, this.to),
          blockTarget.id,
        );
      } else {
        const blockSource = draft[this.source];
        const blockTarget = draft[this.target];

        const blockMoved = draft[blockSource.children.children[this.from]];

        draft[this.source] = blockSource.type.create(
          blockSource.props,
          blockSource.style,
          blockSource.children.remove([this.from]),
          blockSource.id,
        );

        draft[this.target] = blockTarget.type.create(
          blockTarget.props,
          blockTarget.style,
          blockTarget.children.insert(blockMoved, this.to),
          blockTarget.id,
        );
      }

      this.meta.changed = this.target;
    });

    return StepResult.ok(newBlocks);
  }

  invert(blocks: Blocks) {
    return StepResult.ok(applyPatches(blocks, this.inversePatches));
  }
}
