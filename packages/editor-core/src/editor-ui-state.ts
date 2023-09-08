import { makeAutoObservable } from 'mobx';

import { BlockId } from '@chameleon/engine';

type RenderMode = 'preview' | 'editor';

export class EditorUIState {
  renderMode: RenderMode = 'editor';

  blockSettings: {
    isOpen: boolean;
    blockId: BlockId | null;
  } = {
    isOpen: false,
    blockId: null,
  };

  constructor() {
    makeAutoObservable(this);
  }

  changeRenderMode(mode: RenderMode) {
    this.renderMode = mode;
  }

  openBlockSettings(blockId: BlockId) {
    this.blockSettings = {
      isOpen: true,
      blockId,
    };
  }

  closeBlockSettings() {
    this.blockSettings = {
      isOpen: false,
      blockId: null,
    };
  }
}
