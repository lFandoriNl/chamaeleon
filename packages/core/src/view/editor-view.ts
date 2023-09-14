import { EditorState } from '../state/editor-state';

export class EditorView {
  public state: EditorState;

  constructor(props: { state: EditorState }) {
    this.state = props.state;
  }
}
