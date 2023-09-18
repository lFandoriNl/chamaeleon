import { BlockConfig } from '.';
import { BlockSpec } from './model/schema';
import { Plugin } from './state/plugin';
import { BlockViewRendererPack, Properties, RawCommands } from './types';

declare module '.' {
  interface BlockConfig<Options = any> {
    name: string;

    defaultOptions?: Options;

    addOptions?: () => Options;

    addCommands?: () => Partial<RawCommands>;

    addPlugins?: () => Plugin[];

    allowContent?:
      | BlockSpec['allowContent']
      | (() => BlockSpec['allowContent']);

    addProperties?: () => Properties;

    addBlockViews?: () => BlockViewRendererPack;
  }
}

export class Block<Options = any> {
  type = 'block' as const;

  name = 'block';

  options!: Options;

  config: BlockConfig = {
    name: this.name,
    defaultOptions: {},
  };

  constructor(config: Partial<BlockConfig<Options>> = {}) {
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

  static create<O = any>(config: Partial<BlockConfig<O>> = {}) {
    return new Block<O>(config);
  }
}
