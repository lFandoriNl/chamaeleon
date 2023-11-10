import { useCallback, useSyncExternalStore } from 'react';

import { Editor } from './editor';
import { EditorView } from './view';
import { Block, BlockSpec, Schema } from './model';
import { Plugin, PluginApplyMethods } from './state';
import { BlockViewRendererPack, Provider, RawCommands } from './types';
import { EventEmitter } from './event-emitter';

import { isFunction } from './utilities/is-function';
import { getPropertiesFromSpec } from './helpers/get-properties-from-spec';

function throwIfHasDuplicatePlugins(plugins: Plugin[]) {
  const countPluginsByName: Partial<Record<Plugin['name'], number>> = {};

  plugins.forEach((plugin) => {
    const pluginCount = countPluginsByName[plugin.name];

    if (pluginCount) {
      countPluginsByName[plugin.name] = pluginCount + 1;
    } else {
      countPluginsByName[plugin.name] = 1;
    }
  });

  Object.entries(countPluginsByName).forEach(([name, count]) => {
    if (count && count > 1) {
      throw new Error(`Plugin "${name}" already exists.`);
    }
  });
}

export class PluginManager extends EventEmitter<{
  'state-update': Plugin['name'];
}> {
  editor: Editor;

  plugins: Plugin[];

  schema!: Schema;

  commands!: RawCommands;

  pluginViews: {
    common: EditorView['pluginCommonViews'];
    props: EditorView['pluginPropsViews'];
    style: EditorView['pluginStyleViews'];
  } = {
    common: [],
    props: [],
    style: [],
  };

  blockViews: Record<Block['type']['name'], BlockViewRendererPack> = {};

  providers: Provider[] = [];

  constructor(plugins: Plugin[], editor: Editor) {
    super();

    throwIfHasDuplicatePlugins(plugins);

    this.editor = editor;

    this.plugins = plugins;

    this.apply();
  }

  pluginStateChanged(name: Plugin['name']) {
    this.emit('state-update', name);
  }

  apply() {
    const blocks: Record<Block['type']['name'], BlockSpec> = {};

    this.plugins.forEach((plugin) => {
      if (!plugin.apply) return;

      const methods: PluginApplyMethods = {
        addCommands: (commands) => {
          this.commands = {
            ...this.commands,
            ...commands,
          };
        },
        addProvider: (provider) => {
          this.providers.push(provider);
        },
        addBlock: (spec) => {
          const blockProperties = getPropertiesFromSpec(spec.props || {});

          const schema: BlockSpec = {
            allowContent: spec.allowContent,
            withValue: spec.withValue,
            withChildren: spec.withChildren,
            rootable: spec.rootable,
            structural: spec.structural,
            props: Object.fromEntries(
              blockProperties.map((blockProperty) => {
                return [
                  blockProperty.name,
                  { default: blockProperty?.property?.default },
                ];
              }),
            ),
            style: spec.style,
          };

          if (blocks[spec.name]) {
            throw new Error(`Block "${spec.name}" already exists.`);
          }

          blocks[spec.name] = schema;

          if (spec.components) {
            this.blockViews[spec.name] = spec.components;
          }
        },
        addView: (params) => {
          this.pluginViews.common.push({
            name: plugin.name,
            params,
          });
        },
        addPropsView: (params) => {
          this.pluginViews.props.push({
            name: plugin.name,
            params,
          });
        },
        addStyleView: (params) => {
          this.pluginViews.style.push({
            name: plugin.name,
            params,
          });
        },
        getState: () => {
          return this.editor.state.getPluginState(plugin.name);
        },
        setState: (state) => {
          if (isFunction(state)) {
            const newState = state(
              this.editor.state.getPluginState(plugin.name),
            );

            this.editor.state.setPluginState(plugin.name, newState);
          } else {
            this.editor.state.setPluginState(plugin.name, state);
          }

          this.pluginStateChanged(plugin.name);
        },
        usePluginState: () => {
          const subscribe = useCallback((onStoreChange: () => void) => {
            const listener = (name: Plugin['name']) => {
              if (name === plugin.name) {
                onStoreChange();
              }
            };

            this.on('state-update', listener);

            return () => {
              this.off('state-update', listener);
            };
          }, []);

          const state = useSyncExternalStore(
            subscribe,
            () => methods.getState(),
            () => methods.getState(),
          );

          return [state, methods.setState];
        },
      };

      plugin.apply(this.editor, methods);
    });

    this.schema = new Schema({
      blocks,
    });
  }

  async init() {
    const promises = this.plugins.map((plugin) => {
      const { init } = plugin;

      if (!init) return;

      return () => init(this.editor);
    });

    for (const promise of promises) {
      if (promise) {
        await promise();
      }
    }
  }
}
