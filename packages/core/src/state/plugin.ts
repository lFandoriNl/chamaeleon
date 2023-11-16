import { Editor } from '../editor';
import { Block, BlockSpec, Style } from '../model';
import {
  BlockViewRendererPack,
  Properties,
  Provider,
  RawCommands,
} from '../types';

import { EditorState, EditorStateConfig } from './editor-state';
import { Transaction } from './transaction';

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

export type PluginCommonComponent = React.FunctionComponent<{ editor: Editor }>;

export type PluginPropsComponent = React.FunctionComponent<{
  editor: Editor;
  block: Block;
}>;

export type PluginStyleComponent = React.FunctionComponent<{
  editor: Editor;
  layer: keyof Style;
  styleSpec: React.CSSProperties;
  style: React.CSSProperties;
  block: Block;
}>;

export type PluginCommonView = {
  name?: string;
  filter?: () => boolean;
  component: PluginCommonComponent;
};

export type PluginPropsView = {
  name?: string;
  filter: (block: Block) => boolean;
  component: PluginPropsComponent;
};

export type PluginStyleView = {
  name?: string;
  filter: (
    styleSpec: React.CSSProperties,
    block: Block,
    layer: keyof Style,
  ) => boolean;
  component: PluginStyleComponent;
};

export type PluginApplyMethods<PluginState = any> = {
  addCommands: (commands: Partial<RawCommands>) => void;

  addProvider: (provider: Provider) => void;

  addBlock: (spec: {
    name: string;
    allowContent?: BlockSpec['allowContent'];
    withValue?: BlockSpec['withValue'];
    withChildren?: BlockSpec['withChildren'];
    rootable?: BlockSpec['rootable'];
    structural?: BlockSpec['structural'];
    props?: Properties;
    style?: BlockSpec['style'];
    components?: BlockViewRendererPack;
  }) => void;

  addView: (view: PluginCommonView) => void;

  addPropsView: (view: PluginPropsView) => void;

  addStyleView: (view: PluginStyleView) => void;

  getState: () => PluginState;
  setState: (
    state: PluginState | ((prevState: PluginState) => PluginState),
  ) => void;
  usePluginState: () => [
    PluginState,
    PluginApplyMethods<PluginState>['setState'],
  ];
};

export type Plugin<PluginState = any> = {
  name: string;
  state?: StateField<PluginState>;
  init?: (editor: Editor) => Promise<void> | void;
  apply?: (editor: Editor, methods: PluginApplyMethods<PluginState>) => void;
  filterTransaction?: (tr: Transaction, state: EditorState) => boolean;
  appendTransaction?: (
    transactions: readonly Transaction[],
    oldState: EditorState,
    newState: EditorState,
  ) => Transaction | null | undefined;
};

export type InferPluginState<T> = T extends Plugin<infer R> ? R : any;
