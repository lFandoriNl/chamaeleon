import { EditorView } from './view/editor-view';
import { EditorState } from './state/editor-state';

import { ExtensionManager } from './extension-manager';
import { CommandManager } from './command-manager';
import { EventEmitter } from './event-emitter';

import { Commands } from './extensions/commands';
import { Page } from './extensions/page';

import { Schema } from './model/schema';

import { EditorEvents, EditorOptions, SingleCommands } from './types';
import { Row, Column, Text } from './extensions';

export class Editor extends EventEmitter<EditorEvents> {
  private commandManager: CommandManager;

  extensionManager!: ExtensionManager;

  schema: Schema;

  view!: EditorView;

  options: EditorOptions = {
    blocks: {},
  };

  constructor(options: Partial<EditorOptions> = {}) {
    super();

    this.setOptions(options);

    this.createExtensionManager();

    this.schema = this.extensionManager.schema;

    this.commandManager = new CommandManager({
      editor: this,
    });

    this.createView();
  }

  get state() {
    return this.view.state;
  }

  get commands(): SingleCommands {
    return this.commandManager.commands;
  }

  setOptions(options: Partial<EditorOptions> = {}) {
    this.options = {
      ...this.options,
      ...options,
    };
  }

  private createExtensionManager() {
    const coreExtensions = [Commands, Page, Row, Column, Text];

    this.extensionManager = new ExtensionManager(coreExtensions, this);
  }

  private createView() {
    this.view = new EditorView(document.body, {
      state: EditorState.create({
        schema: this.schema,
        blocks: this.options.blocks,
        plugins: this.extensionManager.plugins,
      }),
    });

    this.createBlockViews();
  }

  private createBlockViews() {
    this.view.setProps({
      blockViews: this.extensionManager.blockViews,
    });
  }
}
