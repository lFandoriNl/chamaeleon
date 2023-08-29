import { expect, describe, it, beforeEach } from 'vitest';

import { Engine } from './engine';

describe('Engine', () => {
  /** @type import('./engine').Engine */
  let engine;

  beforeEach(() => {
    engine = new Engine();
  });

  it('should add root page block', () => {
    const rootBlock = engine.addRootPageBlock('row');

    expect(engine.pages[engine.currentPageId].props.children).toBe(
      rootBlock.id,
    );
    expect(engine.currentBlockId).toBe(rootBlock.id);
  });

  it('should add block', () => {
    const rootBlock = engine.addRootPageBlock('row');
    const block = engine.addBlock('column', rootBlock.id);

    expect(engine.blocks[rootBlock.id].props.children).toEqual([block.id]);
    expect(engine.currentBlockId).toBe(block.id);

    engine.debugBlocks();
  });
});
