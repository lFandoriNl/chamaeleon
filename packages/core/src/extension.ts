import { Editor, ExtensionConfig } from '.';
import { Plugin } from './state/plugin';
import { RawCommands } from './types';

declare module '.' {
  interface ExtensionConfig<Options = any> {
    name: string;

    defaultOptions?: Options;

    addOptions?: () => Options;

    addCommands?: () => Partial<RawCommands>;

    addPlugins?: (this: { editor: Editor; options: Options }) => Plugin[];
  }
}

export class Extension<Options = any> {
  type = 'extension' as const;

  name = 'extension';

  options!: Options;

  config: ExtensionConfig = {
    name: this.name,
    defaultOptions: {},
  };

  constructor(config: Partial<ExtensionConfig<Options>> = {}) {
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

  static create<O = any>(config: Partial<ExtensionConfig<O>> = {}) {
    return new Extension<O>(config);
  }
}
