import { EditorView, EditorViewOptions } from './view';
import { EditorState, Blocks, Transaction } from './state';

import { ExtensionManager } from './extension-manager';
import { CommandManager } from './command-manager';
import { EventEmitter } from './event-emitter';

import { Commands, History, Page, Row, Column, Text } from './extensions';

import { Schema } from './model/schema';

import { EditorEvents, Extensions, SingleCommands } from './types';

export type EditorOptions = Pick<
  EditorViewOptions,
  'propertyConfigurationRender' | 'ui'
> & {
  blocks: Blocks;
  extensions: Extensions;
};

export class Editor extends EventEmitter<EditorEvents> {
  private commandManager: CommandManager;

  extensionManager!: ExtensionManager;

  schema: Schema;

  view!: EditorView;

  options: EditorOptions = {
    blocks: {},
    extensions: [],
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

  get chain() {
    return this.commandManager.chain();
  }

  setOptions(options: Partial<EditorOptions> = {}) {
    this.options = {
      ...this.options,
      ...options,
    };

    if (this.view) {
      this.view.setOptions({
        propertyConfigurationRender: this.options.propertyConfigurationRender,
        ui: this.options.ui,
      });
    }
  }

  private createExtensionManager() {
    const coreExtensions = [Commands, History, Page, Row, Column, Text];

    const allExtensions = [...coreExtensions, ...this.options.extensions];

    this.extensionManager = new ExtensionManager(allExtensions, this);
  }

  private createView() {
    this.view = new EditorView({
      state: EditorState.create({
        schema: this.schema,
        blocks: this.options.blocks,
        plugins: this.extensionManager.plugins,
      }),
      dispatchTransaction: this.dispatchTransaction.bind(this),
      propertyConfigurationRender: this.options.propertyConfigurationRender,
      ui: this.options.ui,
    });

    this.createBlockViews();
  }

  private createBlockViews() {
    this.view.setOptions({
      blockViews: this.extensionManager.blockViews,
    });
  }

  private dispatchTransaction(transaction: Transaction) {
    // if (this.view.isDestroyed) {
    //   return;
    // }

    const state = this.state.apply(transaction);
    this.view.updateState(state);

    this.emit('transaction', {
      editor: this,
      transaction,
    });

    this.emit('update', {
      editor: this,
      transaction,
    });
  }
}
