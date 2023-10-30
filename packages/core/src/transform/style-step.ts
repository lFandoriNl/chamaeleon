import { applyPatches } from 'immer';
import { Blocks } from '../state';
import { Step, StepResult } from './step';
import { Block, Style } from '../model';

export class StyleStep extends Step {
  constructor(
    private target: Block['id'],
    private layer: keyof Style,
    private style: NonNullable<Style[string]>,
  ) {
    super();
  }

  apply(blocks: Blocks) {
    if (!blocks[this.target])
      return StepResult.fail('There is no block with this id' + this.target);

    const newBlocks = this.produceWithPatches(blocks, (draft) => {
      const block = draft[this.target];

      draft[this.target] = block.type.create(
        block.props,
        {
          ...block.style,
          [this.layer]: {
            ...block.style[this.layer],
            ...this.style,
          },
        },
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
