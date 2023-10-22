import { EditorView, EditorViewOptions } from './view';
import { EditorState, RawBlocks, Transaction } from './state';

import { ExtensionManager } from './extension-manager';
import { CommandManager } from './command-manager';
import { EventEmitter } from './event-emitter';

import {
  Commands,
  DragAndDrop,
  BaseStyle,
  Page,
  Row,
  Column,
  Text,
} from './extensions';

import { Schema } from './model/schema';

import { EditorEvents, Extensions, SingleCommands } from './types';
import { Logger, createLogger } from './logger';
import { noop } from './utilities/noop';

export type EditorOptions = Pick<
  EditorViewOptions,
  'propertyConfigurationRender' | 'ui'
> & {
  blocks: RawBlocks;
  extensions: Extensions;
  logger?: {
    enabled?: boolean;
  };
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

  logger: Logger = {
    init: noop,
    log: noop,
    info: noop,
    warn: noop,
    error: noop,
    action: noop,
    system: noop,
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

    if (options.logger?.enabled) {
      this.logger = createLogger();
    }

    this.initExtensions();
  }

  private async initExtensions() {
    await this.extensionManager.init();

    this.emit('ready', { editor: this });

    this.logger.system('Editor initialized.');
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
    const coreExtensions = [
      Commands,
      DragAndDrop,
      BaseStyle,
      Page,
      Row,
      Column,
      Text,
    ];

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
      extensionProviders: this.extensionManager.providers,
    });

    this.createBlockViews();
  }

  private createBlockViews() {
    this.view.setOptions({
      blockViews: this.extensionManager.blockViews,
    });
  }

  private dispatchTransaction(transaction: Transaction) {
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
