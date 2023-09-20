import { BlockExtensionConfig } from '.';
import { BlockSpec } from './model/schema';
import { Plugin } from './state/plugin';
import { BlockViewRendererPack, Properties, RawCommands } from './types';

declare module '.' {
  interface BlockExtensionConfig<Options = any> {
    name: string;

    defaultOptions?: Options;

    addOptions?: () => Options;

    addCommands?: () => Partial<RawCommands>;

    addPlugins?: () => Plugin[];

    allowContent?:
      | BlockSpec['allowContent']
      | (() => BlockSpec['allowContent']);

    withValue?: BlockSpec['withValue'] | (() => BlockSpec['withValue']);

    withChildren?:
      | BlockSpec['withChildren']
      | (() => BlockSpec['withChildren']);

    structural?: BlockSpec['structural'] | (() => BlockSpec['structural']);

    addProperties?: () => Properties;

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

  static create<O = any>(config: Partial<BlockExtensionConfig<O>> = {}) {
    return new BlockExtension<O>(config);
  }
}
