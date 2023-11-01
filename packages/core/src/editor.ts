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

import {
  Logger,
  AnyExtension,
  EditorEvents,
  Extensions,
  SingleCommands,
} from './types';

export type EditorOptions = Pick<
  EditorViewOptions,
  'propertyConfigurationRender' | 'ui'
> & {
  blocks: RawBlocks;
  extensions: Extensions;
  loggers?: Logger[];
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
    log: (data) => this.loggers.forEach((logger) => logger.log(data)),
    info: (data) => this.loggers.forEach((logger) => logger.info(data)),
    warn: (data) => this.loggers.forEach((logger) => logger.warn(data)),
    error: (data) => this.loggers.forEach((logger) => logger.error(data)),
    action: (data) => this.loggers.forEach((logger) => logger.action(data)),
    system: (data) => this.loggers.forEach((logger) => logger.system(data)),
  };

  private loggers: Logger[] = [];

  constructor(options: Partial<EditorOptions> = {}) {
    super();

    this.setOptions(options);

    this.createExtensionManager();

    this.schema = this.extensionManager.schema;

    this.commandManager = new CommandManager({
      editor: this,
    });

    this.createView();

    this.loggers = options.loggers || [];

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
    this.view = new EditorView(this, {
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

  configureExtension<T extends AnyExtension>(
    extension: T,
    configure: (extension: T) => T,
  ) {
    this.extensionManager.configureExtension(extension, configure);
  }
}
