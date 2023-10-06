import { Editor, ExtensionConfig } from '.';
import { Plugin, Transaction } from './state';

import { mergeDeep } from './utilities/merge-deep';

import { RawCommands } from './types';

declare module '.' {
  interface ExtensionConfig<Options = any> {
    name: string;

    defaultOptions?: Options;

    addOptions?: () => Options;

    addCommands?: (context: {
      editor: Editor;
      options: Options;
    }) => Partial<RawCommands>;

    addPlugins?: (context: { editor: Editor; options: Options }) => Plugin[];

    init?: (context: {
      editor: Editor;
      options: Options;
    }) => void | Promise<void>;

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

  configure(options: Partial<Options> = {}) {
    const extension = new Extension<Options>(this.config);

    extension.options = mergeDeep(
      this.options as Record<string, any>,
      options,
    ) as Options;

    return extension;
  }

  static create<Options = any>(config: Partial<ExtensionConfig<Options>> = {}) {
    return new Extension<Options>(config);
  }
}
