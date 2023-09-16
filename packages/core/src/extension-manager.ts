import { Editor } from '.';
import { getSchemaByResolvedExtensions } from './helpers/get-schema-by-resolved-extensions';
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

        if (addPlugins) {
          return addPlugins();
        }

        return [];
      })
      .flat();
  }
}
