import { BlockExtensionConfig, type Editor } from '.';
import { Plugin, Transaction } from './state';
import { BlockSpec } from './model';

import { mergeDeep } from './utilities/merge-deep';

import { BlockViewRendererPack, Properties, RawCommands } from './types';

declare module '.' {
  interface BlockExtensionConfig<Options = any> {
    name: string;

    defaultOptions?: Options;

    addOptions?: () => Options;

    addCommands?: (context: {
      editor: Editor;
      options: Options;
    }) => Partial<RawCommands>;

    addPlugins?: (context: { editor: Editor; options: Options }) => Plugin[];

    onUpdate?: (context: { options: Options; editor: Editor }) => void;

    onTransaction?: (
      context: {
        options: Options;
        editor: Editor;
      },
      props: {
        transaction: Transaction;
      },
    ) => void;

    allowContent?:
      | BlockSpec['allowContent']
      | (() => BlockSpec['allowContent']);

    withValue?: BlockSpec['withValue'] | (() => BlockSpec['withValue']);

    withChildren?:
      | BlockSpec['withChildren']
      | (() => BlockSpec['withChildren']);

    rootable?: BlockSpec['rootable'] | (() => BlockSpec['rootable']);

    structural?: BlockSpec['structural'] | (() => BlockSpec['structural']);

    addProperties?: (context: {
      editor: Editor;
      options: Options;
    }) => Properties;

    addStyle?: (context: {
      editor: Editor;
      options: Options;
    }) => BlockSpec['style'];

    addBlockViews?: () => BlockViewRendererPack;
  }
}

export class BlockExtension<Options = any> {
  type = 'block' as const;

  name = 'block';

  options!: Options;

  config: BlockExtensionConfig = {
    name: this.name,
    defaultOptions: {},
  };

  constructor(config: Partial<BlockExtensionConfig<Options>> = {}) {
    this.config = {
      ...this.config,
      ...config,
    };

    this.name = this.config.name;

    const { addOptions } = this.config;

    if (addOptions) {
      this.options = addOptions();
    }
  }

  configure(options: Partial<Options> = {}) {
    const extension = new BlockExtension<Options>(this.config);

    extension.options = mergeDeep(
      this.options as Record<string, any>,
      options,
    ) as Options;

    return extension;
  }

  static create<Options = any>(
    config: Partial<BlockExtensionConfig<Options>> = {},
  ) {
    return new BlockExtension<Options>(config);
  }
}
