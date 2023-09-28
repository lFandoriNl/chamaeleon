import React from 'react';

import { PropertyConfigurationRender } from './property-configuration-render';
import { StyleConfigurationRender } from './style-configuration-render';

import { Block } from '../model';
import {
  EditorState,
  Plugin,
  PluginType,
  PluginView,
  Transaction,
} from '../state';
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
  styleConfigurationRender?: React.FunctionComponent<{ view: EditorView }>;
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

  styleConfiguration: {
    Render: React.FunctionComponent<{ view: EditorView }>;
  } = {
    Render: StyleConfigurationRender,
  };

  pluginViews: Map<
    Plugin['key'],
    {
      [type in PluginType]: {
        type: type;
        plugin: Plugin<any, type>;
        renderRules: {
          conditionals: Array<() => boolean>;
        };
        updateParams: () => Parameters<NonNullable<PluginView['update']>>;
        view: ReturnType<NonNullable<Plugin<any, type>['spec']['view']>>;
      };
    }[PluginType]
  > = new Map();

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

    // this.updatePluginViews();
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
        const ComponentWithViewInjected = React.forwardRef<HTMLElement>(
          (props, ref) => {
            return React.createElement(Component, {
              ...props,
              view: this,
              ref,
            });
          },
        );

        ComponentWithViewInjected.displayName =
          (Component.displayName || Component.name || 'Unknown') +
          '.InjectView';

        ui[name] = ComponentWithViewInjected;

        return ui;
      },
      {} as EditorView['ui'],
    );
  }

  private updatePluginViews(prevState: EditorState) {
    // if (!prevState || prevState.plugins != this.state.plugins) {
    if (prevState.plugins != this.state.plugins) {
      this.destroyPluginViews();
    }

    this.state.plugins.forEach((plugin) => {
      if (!plugin.spec.view) return;

      if (plugin.is('common')) {
        this.pluginViews.set(plugin.key, {
          type: 'common',
          plugin,
          renderRules: {
            conditionals: [],
          },
          updateParams: () => [this, prevState],
          view: plugin.spec.view(this),
        });
      }

      if (plugin.is('property-configuration')) {
        this.pluginViews.set(plugin.key, {
          type: 'property-configuration',
          plugin,
          renderRules: {
            conditionals: [
              () => {
                const { property } = plugin.spec;
                const { state } = this;
                const { activeBlock } = state;

                if (!activeBlock) return false;

                if (activeBlock.type.props[property.name]) {
                  const allowBlocks = state.schema
                    .getAllowContent(property.applicable || {})
                    .map((blockType) => blockType.name);

                  return allowBlocks.includes(activeBlock.type.name);
                }

                return false;
              },
            ],
          },
          updateParams: () => [this, prevState],
          view: plugin.spec.view(this),
        });
      }

      if (plugin.is('style-configuration')) {
        this.pluginViews.set(plugin.key, {
          type: 'style-configuration',
          plugin,
          renderRules: {
            conditionals: [() => Boolean(this.state.activeBlock)],
          },
          updateParams: () => [this, prevState],
          view: plugin.spec.view(this),
        });
      }
    });
  }

  private destroyPluginViews() {
    Array.from(this.pluginViews)
      .reverse()
      .forEach(([_, { view }]) => {
        view.destroy?.();
      });

    this.pluginViews.clear();
  }
}
