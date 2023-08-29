import { toJS } from 'mobx';

import { expect, describe, it, beforeEach } from 'vitest';

import { Engine } from './engine';

describe('Engine', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  it('should add root page block', () => {
    engine.addRootPageBlock('row');

    setTimeout(() => {
      console.log(toJS(engine.pages), toJS(engine.blocks));
    }, 0);
  });
});
