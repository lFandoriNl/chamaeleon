import { BlockExtensionConfig, Editor } from '.';
import { BlockExtension } from './block-extension';
import { getSchemaByResolvedExtensions } from './helpers/get-schema-by-resolved-extensions';
import { splitExtensions } from './helpers/split-extensions';
import { Schema } from './model/schema';
import { Plugin } from './state/plugin';
import { AnyExtension, Extensions, Provider, RawCommands } from './types';

export class ExtensionManager {
  editor: Editor;

  schema: Schema;

  extensions: Extensions;

  constructor(extensions: Extensions, editor: Editor) {
    this.editor = editor;

    this.extensions = extensions;

    this.schema = getSchemaByResolvedExtensions(this.extensions, this.editor);

    this.extensions.forEach((extension) => {
      const context = {
        options: extension.options,
        editor: this.editor,
      };

      const { onTransaction, onUpdate } = extension.config;

      if (onTransaction) {
        this.editor.on('transaction', (event) => onTransaction(context, event));
      }

      if (onUpdate) {
        this.editor.on('update', () => onUpdate(context));
      }
    });
  }

  async init() {
    const promises = this.extensions.map((extension) => {
      const { init } = extension.config;

      if (!init) return;

      return () =>
        init({
          editor: this.editor,
          options: extension.options,
        });
    });

    for (const promise of promises) {
      if (promise) {
        await promise();
      }
    }
  }

  configureExtension<T extends AnyExtension>(
    extension: T,
    configure: (extension: T) => T,
  ) {
    const extensionToChange = this.extensions.find(
      (ext) => ext.name === extension.name,
    ) as T | undefined;

    if (!extensionToChange) {
      throw new Error(
        `Extension "${extension.name}" not found in editor.configureExtension.`,
      );
    }

    const changedExtension = configure(extensionToChange);

    this.extensions = this.extensions.map((extension) => {
      if (extension.name === changedExtension.name) {
        return changedExtension;
      }

      return extension;
    });

    this.editor.view.updateState(
      this.editor.state.reconfigure({
        plugins: this.plugins,
      }),
    );
  }

  get commands(): RawCommands {
    return this.extensions.reduce((commands, extension) => {
      const { addCommands } = extension.config;

      if (!addCommands) {
        return commands;
      }

      const context = {
        editor: this.editor,
        options: extension.options,
      };

      return {
        ...commands,
        ...addCommands(context),
      };
    }, {} as RawCommands);
  }

  get plugins(): Plugin[] {
    return this.extensions
      .map((extension) => {
        const { addPlugins } = extension.config;

        const context = {
          editor: this.editor,
          options: extension.options,
        };

        if (addPlugins) {
          return addPlugins(context);
        }

        return [];
      })
      .flat();
  }

  get providers(): Provider[] {
    return this.extensions
      .map((extension) => {
        const { addProvider } = extension.config;

        if (addProvider) {
          return [addProvider()];
        }

        return [];
      })
      .flat();
  }

  get blockViews(): Record<
    BlockExtension['name'],
    ReturnType<NonNullable<BlockExtensionConfig['addBlockViews']>>
  > {
    const { blockExtensions } = splitExtensions(this.extensions);

    return Object.fromEntries(
      blockExtensions
        .filter((extension) => Boolean(extension.config.addBlockViews))
        .map((extension) => {
          const { addBlockViews } = extension.config;

          if (!addBlockViews) return [];

          const blockViews = addBlockViews();

          return [extension.name, blockViews];
        }),
    );
  }
}
