import { EditorState, EditorStateConfig } from './editor-state';
import { Transaction } from './transaction';

const keys: Record<string, number> = {};

function createKey(name: string) {
  if (name in keys) return name + '$' + ++keys[name];
  keys[name] = 0;
  return name + '$';
}

export class PluginKey<PluginState = any> {
  key: string;

  constructor(name = 'key') {
    this.key = createKey(name);
  }

  /// Get the active plugin with this key, if any, from an editor
  /// state.
  get(state: EditorState): Plugin<PluginState> | undefined {
    return state.config.pluginsByKey[this.key];
  }

  /// Get the plugin's state from an editor state.
  getState(state: EditorState): PluginState | undefined {
    return (state as any)[this.key];
  }
}

export type StateField<T> = {
  init: (config: EditorStateConfig, instance: EditorState) => T;
  apply: (
    tr: Transaction,
    value: T,
    oldState: EditorState,
    newState: EditorState,
  ) => T;

  toJSON?: (value: T) => any;
  fromJSON?: (config: EditorStateConfig, value: any, state: EditorState) => T;
};

export type PluginSpec<PluginState> = {
  key?: PluginKey;
  state?: StateField<PluginState>;
  filterTransaction?: (tr: Transaction, state: EditorState) => boolean;
  appendTransaction?: (
    transactions: readonly Transaction[],
    oldState: EditorState,
    newState: EditorState,
  ) => Transaction | null | undefined;
};

export class Plugin<PluginState = any> {
  key: string;

  constructor(readonly spec: PluginSpec<PluginState>) {
    this.key = spec.key ? spec.key.key : createKey('plugin');
  }

  getState(state: EditorState): PluginState | undefined {
    return (state as any)[this.key];
  }
}
