import { Block } from '../model';
import { Blocks } from '../state/editor-state';
import { InsertStep } from './insert-step';
import { MoveStep } from './move-step';
import { PropertyStep } from './property-step';
import { RemoveStep } from './remove-step';
import { Step } from './step';

class TransformError extends Error {
  name = 'TransformError' as const;

  constructor(message: string) {
    super(message);
  }
}

export class Transform {
  readonly steps: Step[] = [];

  constructor(
    public blocks: Blocks,
    public lastModifiedBlock: Block['id'] | null,
  ) {}

  insertContent(target: Block['id'], block: Block): this {
    this.step(new InsertStep(target, block));

    this.lastModifiedBlock = block.id;

    return this;
  }

  removeContent(target: Block['id'], blockIds?: Array<Block['id']>) {
    this.step(new RemoveStep(target, blockIds));

    this.lastModifiedBlock = target;

    return this;
  }

  changeProperty(
    target: Block['id'],
    property: keyof Block['props'],
    value: any,
  ) {
    this.step(new PropertyStep(target, property, value));

    this.lastModifiedBlock = target;

    return this;
  }

  move(source: Block['id'], target: Block['id'], from: number, to: number) {
    this.step(new MoveStep(source, target, from, to));

    this.lastModifiedBlock = target;

    return this;
  }

  step(step: Step) {
    const result = this.maybeStep(step);

    if (result.failed) {
      throw new TransformError(result.failed);
    }

    return this;
  }

  private maybeStep(step: Step) {
    const result = step.apply(this.blocks);

    if (!result.failed) {
      this.addStep(step, result.blocks!);
    }

    return result;
  }

  protected addStep(step: Step, blocks: Blocks) {
    this.steps.push(step);

    this.blocks = blocks;
  }
}
