import { enablePatches, produce, Patch } from 'immer';
import { Blocks } from '../state';
import { Block } from '../model';

enablePatches();

export abstract class Step {
  public meta: {
    changed: Block['id'] | null;
    changedParent?: Block['id'];
  } = {
    changed: null,
  };

  protected inversePatches!: Patch[];

  abstract apply(blocks: Blocks): StepResult;

  abstract invert(blocks: Blocks): StepResult;

  protected produceWithPatches(
    blocks: Blocks,
    producer: (blocks: Blocks) => Blocks | void,
  ) {
    return produce(blocks, producer, (p, inversePatches) => {
      this.inversePatches = inversePatches;
    });
  }
}

export class StepResult {
  constructor(
    readonly blocks: Blocks | null,
    readonly failed: string | null,
  ) {}

  static ok(blocks: Blocks) {
    return new StepResult(blocks, null);
  }

  static fail(message: string) {
    return new StepResult(null, message);
  }
}
