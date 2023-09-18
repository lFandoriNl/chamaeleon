export { Editor } from './editor';
export { Extension } from './extension';
export * as extensions from './extensions';
export { Block } from './model';
export * as commands from './commands';
export type {
  EditorEvents,
  BlockViewRenderer,
  BlockViewRendererPack,
} from './types';

// eslint-disable-next-line
export interface Commands<ReturnType = any> {}

// eslint-disable-next-line
export interface ExtensionConfig<Options = any> {}

// eslint-disable-next-line
export interface BlockConfig<Options = any> {}
