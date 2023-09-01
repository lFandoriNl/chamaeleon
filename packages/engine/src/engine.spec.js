import { expect, describe, it, beforeEach } from 'vitest';

import { Engine } from './engine';

describe('Engine', () => {
  /** @type import('./engine').Engine */
  let engine;

  beforeEach(() => {
    engine = new Engine();
  });

  it('should add root page block', () => {
    const beforeChangeSnapshot = engine.getSnapshot();

    const rootBlock = engine.addRootPageBlock('row');

    const afterChangeSnapshot = engine.getSnapshot();

    expect(engine.pages[engine.currentPageId].props.children).toBe(
      rootBlock.id,
    );
    expect(engine.currentBlockId).toBe(rootBlock.id);

    engine.undo();
    expect(engine.getSnapshot()).toEqual(beforeChangeSnapshot);

    engine.redo();
    expect(engine.getSnapshot()).toEqual(afterChangeSnapshot);
  });

  it('should add block', () => {
    const rootBlock = engine.addRootPageBlock('row');

    const beforeChangeSnapshot = engine.getSnapshot();

    const block = engine.addBlock('column', rootBlock.id);

    const afterChangeSnapshot = engine.getSnapshot();

    expect(engine.getBlock(rootBlock.id).props.children).toEqual([block.id]);
    expect(engine.currentBlockId).toBe(block.id);

    engine.undo();
    expect(engine.getSnapshot()).toEqual(beforeChangeSnapshot);

    engine.redo();
    expect(engine.getSnapshot()).toEqual(afterChangeSnapshot);
  });

  it('should change block content', () => {
    const rootBlock = engine.addRootPageBlock('row');
    const block = engine.addBlock('text', rootBlock.id);

    const beforeChangeSnapshot = engine.getSnapshot();

    engine.changeContent(block.id, 'new content');

    const afterChangeSnapshot = engine.getSnapshot();

    expect(engine.currentBlock.props.content).toBe('new content');

    engine.undo();
    expect(engine.getSnapshot()).toEqual(beforeChangeSnapshot);

    engine.redo();
    expect(engine.getSnapshot()).toEqual(afterChangeSnapshot);

    engine.debugFull();
  });
});
