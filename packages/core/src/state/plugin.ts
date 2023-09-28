import { BlockSpec, Style } from '../model';
import { EditorView } from '../view';
import { EditorState, EditorStateConfig } from './editor-state';
import { Transaction } from './transaction';

const keys: Record<string, number> = {};

function createKey(name: string) {
  if (name in keys) {
    return name + '$' + ++keys[name];
  }

  keys[name] = 0;

  return name + '$';
}

export class PluginKey<PluginState = any> {
  key: string;

  constructor(name = 'key') {
    this.key = createKey(name);
  }

  get(state: EditorState): Plugin<PluginState> | undefined {
    return state.config.pluginsByKey[this.key];
  }

  getState(state: EditorState): PluginState {
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

export type PluginType =
  | 'common'
  | 'property-configuration'
  | 'style-configuration';

export type PluginSpec<PluginState, T extends PluginType = PluginType> = {
  common: {
    key?: PluginKey;
    type: 'common';
    state?: StateField<PluginState>;
    view?: (view: EditorView) => PluginView;
    filterTransaction?: (tr: Transaction, state: EditorState) => boolean;
    appendTransaction?: (
      transactions: readonly Transaction[],
      oldState: EditorState,
      newState: EditorState,
    ) => Transaction | null | undefined;
  };
  'property-configuration': {
    key?: PluginKey;
    type: 'property-configuration';
    property: {
      name: string;
      applicable: BlockSpec['allowContent'];
    };
    state?: StateField<PluginState>;
    view: (view: EditorView) => PluginView;
    filterTransaction?: (tr: Transaction, state: EditorState) => boolean;
    appendTransaction?: (
      transactions: readonly Transaction[],
      oldState: EditorState,
      newState: EditorState,
    ) => Transaction | null | undefined;
  };
  'style-configuration': {
    key?: PluginKey;
    type: 'style-configuration';
    cssProperty: {
      some?: Array<keyof NonNullable<BlockSpec['style']>['root']>;
      every?: Array<keyof NonNullable<BlockSpec['style']>['root']>;
    };
    state?: StateField<PluginState>;
    view: (view: EditorView) => StylePluginView;
    filterTransaction?: (tr: Transaction, state: EditorState) => boolean;
    appendTransaction?: (
      transactions: readonly Transaction[],
      oldState: EditorState,
      newState: EditorState,
    ) => Transaction | null | undefined;
  };
}[T];

export interface PluginView {
  update?: (
    view: EditorView,
    prevState: EditorState,
  ) => React.ReactPortal | null;
  destroy?: () => void;
}

export interface StylePluginView {
  update?: (
    element: keyof Style,
    view: EditorView,
    prevState: EditorState,
  ) => React.ReactNode;
  destroy?: () => void;
}

export class Plugin<PluginState = any, T extends PluginType = PluginType> {
  key: string;

  constructor(readonly spec: PluginSpec<PluginState, T>) {
    this.key = spec.key ? spec.key.key : createKey('plugin');
  }

  getState(state: EditorState): PluginState {
    return (state as any)[this.key];
  }

  is<U extends T>(type: U): this is Plugin<PluginState, U> {
    return this.spec.type === type;
  }
}
