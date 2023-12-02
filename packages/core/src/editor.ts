import { CommandManager } from './command-manager';
import { EventEmitter } from './event-emitter';
import { Schema } from './model';
import { PluginManager } from './plugin-manager';
import { Commands, DragAndDrop } from './plugins';
import {
  EditorState,
  InferPluginState,
  Plugin,
  RawBlocks,
  Transaction,
} from './state';
import { Logger, EditorEvents, SingleCommands, EditorMode } from './types';
import { isFunction } from './utilities/is-function';
import { EditorView, EditorViewOptions } from './view';

export type EditorOptions = Pick<
  EditorViewOptions,
  'propertyConfigurationRender' | 'ui'
> & {
  blocks: RawBlocks;
  plugins: ReadonlyArray<Plugin | ReadonlyArray<Plugin>>;
  loggers?: Logger[];
};

export class Editor extends EventEmitter<EditorEvents> {
  private commandManager: CommandManager;

  pluginManager!: PluginManager;

  schema: Schema;

  view!: EditorView;

  mode: EditorMode = 'editor';

  options: EditorOptions = {
    blocks: {},
    plugins: [],
  };

  pluginViewTokens = {
    configuration: 'configuration',
    addBlockInline: 'addBlockInline',
  } as const;

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

    this.createPluginManager();

    this.schema = this.pluginManager.schema;

    this.createView();

    this.commandManager = new CommandManager({
      editor: this,
    });

    this.loggers = options.loggers || [];

    this.initPlugins();

    this.view.setPluginProviders(this.pluginManager.providers);
    this.view.setPluginViews(
      this.pluginManager.pluginViews.common,
      this.pluginManager.pluginViews.props,
      this.pluginManager.pluginViews.style,
    );
  }

  private async initPlugins() {
    await this.pluginManager.init();

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

  private createPluginManager() {
    const corePlugins = [Commands(), DragAndDrop()];

    const allPlugins = [...corePlugins, ...this.options.plugins];

    this.pluginManager = new PluginManager(allPlugins.flat(), this);
  }

  private createView() {
    this.view = new EditorView(this, {
      state: EditorState.create({
        schema: this.schema,
        blocks: this.options.blocks,
        plugins: this.pluginManager.plugins,
      }),
      dispatchTransaction: this.dispatchTransaction.bind(this),
      propertyConfigurationRender: this.options.propertyConfigurationRender,
      ui: this.options.ui,
    });

    this.createBlockViews();
  }

  private createBlockViews() {
    this.view.setOptions({
      blockViews: this.pluginManager.blockViews,
    });
  }

  changeMode(mode: EditorMode) {
    this.mode = mode;

    this.emit('mode', {
      editor: this,
      mode,
    });

    this.emit('update', {
      editor: this,
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
    });
  }

  getPluginState<T>(plugin: Plugin['name']): T;
  getPluginState<T extends Plugin>(plugin: T): InferPluginState<T>;
  getPluginState<T>(plugin: Plugin | Plugin['name']): T {
    return this.state.getPluginState(this.getPluginName(plugin));
  }

  setPluginState<S>(
    plugin: Plugin['name'],
    state: S | ((prevState: S) => S),
  ): void;
  setPluginState<T extends Plugin, S = InferPluginState<T>>(
    plugin: T,
    state: S | ((prevState: S) => S),
  ): void;
  setPluginState<S>(
    plugin: Plugin | Plugin['name'],
    state: S | ((prevState: S) => S),
  ): void {
    const name = this.getPluginName(plugin);

    if (isFunction(state)) {
      const newState = state(this.state.getPluginState(name));

      this.state.setPluginState(name, newState);
    } else {
      this.state.setPluginState(name, state);
    }

    this.pluginManager.pluginStateChanged(name);
  }

  private getPluginName<T extends Plugin>(plugin: T | T['name']) {
    return typeof plugin === 'string' ? plugin : plugin.name;
  }
}
