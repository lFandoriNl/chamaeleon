import { EditorState, Transaction } from '../state';

export type EditorViewOptions = {
  state: EditorState;
  dispatchTransaction?: (tr: Transaction) => void;
};

export class EditorView {
  private container: HTMLElement;

  state: EditorState;

  private options: EditorViewOptions;

  constructor(container: HTMLElement, options: EditorViewOptions) {
    this.container = container;

    this.options = options;

    this.state = options.state;

    this.dispatch = this.dispatch.bind(this);
  }

  dispatch(tr: Transaction) {
    const { dispatchTransaction } = this.options;

    if (dispatchTransaction) {
      dispatchTransaction.call(this, tr);
    } else {
      this.updateState(this.state.apply(tr));
    }
  }

  updateState(state: EditorState) {
    // rerender editor and plugins

    this.state = state;
  }
}
