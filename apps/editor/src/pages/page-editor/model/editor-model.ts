import { makeAutoObservable } from 'mobx';

type RenderMode = 'preview' | 'editor';

class EditorModel {
  renderMode: RenderMode = 'editor';

  constructor() {
    makeAutoObservable(this);
  }

  changeRenderMode(mode: RenderMode) {
    this.renderMode = mode;
  }
}

export const editorModel = new EditorModel();
