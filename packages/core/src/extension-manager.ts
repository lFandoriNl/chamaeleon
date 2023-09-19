import { BlockConfig, Editor } from '.';
import { Block } from './block';
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

    this.schema = getSchemaByResolvedExtensions(this.extensions);
  }

  get commands(): RawCommands {
    return this.extensions.reduce((commands, extension) => {
      const { addCommands } = extension.config;

      if (!addCommands) {
        return commands;
      }

      return {
        ...commands,
        ...addCommands(),
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
    Block['name'],
    ReturnType<NonNullable<BlockConfig['addBlockViews']>>
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
