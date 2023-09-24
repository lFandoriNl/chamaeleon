import React from 'react';

import { PropertyConfigurationRender } from './property-configuration-render';

import { Block } from '../model';
import { EditorState, PluginView, Transaction } from '../state';
import { AnyExtension, BlockViewRendererPack } from '../types';

import { ActionsTooltip } from './ui/actions-tooltip';
import { PanelButton } from './ui/panel-button';
import { AddExtraBlock } from './ui/add-extra-block';
import { ActionButton } from './ui/action-button';
import { ActionAddBlockButton } from './ui/action-add-block-button';
import { ActionSettingsButton } from './ui/action-settings-button';

type Props<T extends keyof EditorView['rawUI']> = Omit<
  Parameters<EditorView['rawUI'][T]>[0],
  'view'
>;

export type EditorViewOptions = {
  state: EditorState;
  blockViews?: Record<AnyExtension['name'], BlockViewRendererPack>;
  dispatchTransaction?: (tr: Transaction) => void;
  propertyConfigurationRender?: React.FunctionComponent<{ view: EditorView }>;
  ui?: Partial<EditorView['rawUI']>;
};

export class EditorView {
  state: EditorState;

  private _options: EditorViewOptions;

  propertyConfiguration: {
    element: HTMLElement | null;
    Render: React.FunctionComponent<{ view: EditorView }>;
  } = {
    element: null,
    Render: PropertyConfigurationRender,
  };

  pluginViews: Array<{
    view: PluginView;
    portal?: React.ReactPortal | null;
  }> = [];

  private rawUI = {
    ActionsTooltip,
    PanelButton,
    AddExtraBlock,
    ActionButton,
    ActionAddBlockButton,
    ActionSettingsButton,
  };

  ui!: {
    [name in keyof EditorView['rawUI']]: React.FunctionComponent<Props<name>>;
  };

  constructor(options: EditorViewOptions) {
    this._options = options;

    if (options.propertyConfigurationRender) {
      this.propertyConfiguration.Render = options.propertyConfigurationRender;
    }

    this.rawUI = {
      ...this.rawUI,
      ...options.ui,
    };

    this.injectViewToUI();

    this.state = options.state;

    this.dispatch = this.dispatch.bind(this);

    this.updatePluginViews();
  }

  get options() {
    if (this._options.state != this.state) {
      this._options = {
        ...this._options,
        state: this.state,
      };
    }

    return this._options;
  }

  dispatch(tr: Transaction) {
    const { dispatchTransaction } = this._options;

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

  setOptions(options: Partial<EditorViewOptions>) {
    this._options = {
      ...this._options,
      ...options,
      ui: {
        ...this._options.ui,
        ...options.ui,
      },
    };

    this.rawUI = {
      ...this.rawUI,
      ...this._options.ui,
    };

    this.injectViewToUI();
  }

  getBlockViews(name: Block['type']['name']) {
    if (!this.options.blockViews || !this.options.blockViews[name])
      throw new RangeError(
        `BlockViews for "Block.type.name=${name}" does not exist.`,
      );

    return this.options.blockViews[name];
  }

  setPropertyConfigurationElement(element: HTMLElement) {
    this.propertyConfiguration.element = element;
  }

  private injectViewToUI() {
    this.ui = (Object.entries(this.rawUI) as any[]).reduce(
      (ui, [name, Component]) => {
        ui[name] = React.forwardRef<HTMLElement>((props, ref) => {
          return React.createElement(Component, {
            ...props,
            view: this,
            ref,
          });
        });

        ui[name].displayName =
          (Component.displayName || Component.name || 'Unknown') +
          '.InjectView';

        return ui;
      },
      {} as EditorView['ui'],
    );
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
