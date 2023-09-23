import { BlockExtensionConfig, Editor } from '.';
import { BlockExtension } from './block-extension';
import { getSchemaByResolvedExtensions } from './helpers/get-schema-by-resolved-extensions';
import { splitExtensions } from './helpers/split-extensions';
import { Schema } from './model/schema';
import { Plugin } from './state/plugin';
import { Extensions, RawCommands } from './types';

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
        this.editor.on('transaction', onTransaction.bind(context));
      }

      if (onUpdate) {
        this.editor.on('update', onUpdate.bind(context));
      }
    });
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
        ...addCommands.call(context),
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
          return addPlugins.call(context);
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
