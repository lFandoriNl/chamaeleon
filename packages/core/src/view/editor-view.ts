import { EditorState, Transaction } from '../state';
import { AnyExtension, BlockViewRendererPack } from '../types';

export type EditorViewOptions = {
  state: EditorState;
  blockViews?: Record<AnyExtension['name'], BlockViewRendererPack>;
  dispatchTransaction?: (tr: Transaction) => void;
};

export class EditorView {
  private container: HTMLElement;

  state: EditorState;

  private _props: EditorViewOptions;

  constructor(container: HTMLElement, props: EditorViewOptions) {
    this.container = container;

    this._props = props;

    this.state = props.state;

    this.dispatch = this.dispatch.bind(this);
  }

  get props() {
    if (this._props.state != this.state) {
      this._props = {
        ...this._props,
        state: this.state,
      };
    }

    return this._props;
  }

  dispatch(tr: Transaction) {
    const { dispatchTransaction } = this._props;

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

  setProps(props: Partial<EditorViewOptions>) {
    this._props = {
      ...this._props,
      ...props,
    };
  }
}
