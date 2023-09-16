import { applyPatches } from 'immer';
import { Blocks } from '../state';
import { Step, StepResult } from './step';
import { Block } from '../model';

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
        block.children,
      );
    });

    return StepResult.ok(newBlocks);
  }

  invert(blocks: Blocks) {
    return StepResult.ok(applyPatches(blocks, this.inversePatches));
  }
}
