import { BlockConfig, Commands, ExtensionConfig } from '.';
import { Extension } from './extension';
import { Block } from './block';
import { Editor } from './editor';
import { Blocks, EditorState } from './state/editor-state';
import { Transaction } from './state/transaction';
import { EditorView } from './view/editor-view';

export type AnyConfig = ExtensionConfig | BlockConfig;
export type AnyExtension = Extension | Block;
export type Extensions = AnyExtension[];

export type EditorEvents = {
  beforeCreate: [{ test: string }];
};

export type EditorOptions = {
  blocks: Blocks;
};

export type MaybeReturnType<T> = T extends (...args: any) => any
  ? ReturnType<T>
  : T;

export type ValuesOf<T> = T[keyof T];

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type JSONContent = {
  type: string;
  props?: Record<string, any>;
  content?: JSONContent[];
};

export type Content = JSONContent | JSONContent[];

export type Property = {
  default: any;
  isRequired?: boolean;
};

export type Properties = {
  [key: string]: Property;
};

export type ExtensionProperty = {
  type: string;
  name: string;
  property: Required<Property>;
};

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type KeysWithTypeOf<T, Type> = {
  [P in keyof T]: T[P] extends Type ? P : never;
}[keyof T];

export type CommandProps = {
  editor: Editor;
  tr: Transaction;
  commands: SingleCommands;
  // can: () => CanCommands;
  // chain: () => ChainedCommands;
  state: EditorState;
  view: EditorView;
  // dispatch: ((args?: any) => any) | undefined;
};

export type Command = (props: CommandProps) => void;

export type AnyCommands = Record<string, (...args: any[]) => Command>;

export type UnionCommands<T = Command> = UnionToIntersection<
  ValuesOf<Pick<Commands<T>, KeysWithTypeOf<Commands<T>, object>>>
>;

export type RawCommands = {
  [Item in keyof UnionCommands]: UnionCommands<Command>[Item];
};

export type SingleCommands = {
  [Item in keyof UnionCommands]: UnionCommands<void>[Item];
};
