import { describe, it, expect } from 'vitest';

import { Block, BlockType, Fragment, Schema } from '../model';
import { Blocks } from '../state';
import { RemoveStep } from './remove-step';

describe('RemoveStep', () => {
  const schema = new Schema({
    blocks: {
      block: {},
    },
  });

  const createBlock = (id: Block['id'], content: Block['id'][]) => {
    return new Block(
      new BlockType('block', schema, {}),
      {},
      {
        root: {},
      },
      new Fragment(content),
      id,
    );
  };

  const blocks: Blocks = {
    '1': createBlock('1', ['2', '3']),
    '2': createBlock('2', ['5']),
    '3': createBlock('3', []),
    '4': createBlock('4', []),
    '5': createBlock('5', []),
  };

  it('should remove blocks from target', () => {
    const removeStep = new RemoveStep('1', ['2']);

    const result = removeStep.apply(blocks);

    expect(result.blocks).toEqual({
      '1': createBlock('1', ['3']),
      '3': createBlock('3', []),
      '4': createBlock('4', []),
    });
  });

  it('should remove target block with nested blocks', () => {
    const removeStep = new RemoveStep('1');

    const result = removeStep.apply(blocks);

    expect(result.blocks).toEqual({
      '4': createBlock('4', []),
    });
  });
});
