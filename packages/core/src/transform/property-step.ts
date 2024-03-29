import { applyPatches } from 'immer';

import { Block } from '../model';
import { Blocks } from '../state';
import { Step, StepResult } from './step';

export class PropertyStep extends Step {
  constructor(
    private target: Block['id'],
    private property: keyof Block['props'],
    private value: any,
  ) {
    super();
  }

  apply(blocks: Blocks) {
    if (!blocks[this.target])
      return StepResult.fail('There is no block with this id' + this.target);

    const newBlocks = this.produceWithPatches(blocks, (draft) => {
      const block = draft[this.target];

      draft[this.target] = block.type.create(
        {
          ...block.props,
          [this.property]: this.value,
        },
        block.style,
        block.children,
        block.id,
      );

      this.meta.changed = this.target;
    });

    return StepResult.ok(newBlocks);
  }

  invert(blocks: Blocks) {
    return StepResult.ok(applyPatches(blocks, this.inversePatches));
  }
}
