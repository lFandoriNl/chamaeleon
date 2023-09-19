import React from 'react';
import { Block } from '../model';
import { EditorState, Plugin, PluginView, Transaction } from '../state';
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

  pluginViews: Array<{
    view: PluginView;
    portal?: React.ReactPortal;
  }> = [];

  constructor(container: HTMLElement, props: EditorViewOptions) {
    this.container = container;

    this._props = props;

    this.state = props.state;

    this.dispatch = this.dispatch.bind(this);

    this.updatePluginViews();
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
    const prevState = this.state;

    this.state = state;

    this.updatePluginViews(prevState);
  }

  setProps(props: Partial<EditorViewOptions>) {
    this._props = {
      ...this._props,
      ...props,
    };
  }

  getBlockViews(name: Block['type']['name']) {
    if (!this.props.blockViews || !this.props.blockViews[name])
      throw new RangeError(
        `BlockViews for "Block.type.name=${name}" does not exist.`,
      );

    return this.props.blockViews[name];
  }

  private updatePluginViews(prevState?: EditorState) {
    if (!prevState || prevState.plugins != this.state.plugins) {
      this.destroyPluginViews();

      this.state.plugins.forEach((plugin) => {
        if (plugin.spec.view) {
          this.pluginViews.push({
            view: plugin.spec.view(this),
          });
        }
      });
    } else {
      this.pluginViews = this.pluginViews.map(({ view }) => {
        return {
          view,
          portal: view.update?.(this, prevState),
        };
      });
    }
  }

  private destroyPluginViews() {
    this.pluginViews.reverse().forEach(({ view }) => {
      if (view.destroy) {
        view.destroy();
      }
    });

    this.pluginViews = [];
  }
}
