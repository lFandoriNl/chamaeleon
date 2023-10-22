export { Editor } from './editor';
export { Extension } from './extension';
export { BlockExtension } from './block-extension';
export * as extensions from './extensions';
export { EditorView } from './view';
export {
  EditorState,
  Plugin,
  PluginKey,
  Transaction,
  type PluginView,
} from './state';
export { Block } from './model';
export * as commands from './commands';

export * from './tailwind-plugin';

export type {
  Provider,
  EditorEvents,
  BlockViewRenderer,
  BlockViewRendererPack,
} from './types';

// eslint-disable-next-line
export interface Commands<ReturnType = any> {}

// eslint-disable-next-line
export interface ExtensionConfig<Options = any> {}

// eslint-disable-next-line
export interface BlockExtensionConfig<Options = any> {}
