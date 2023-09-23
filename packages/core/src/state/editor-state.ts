import { Transaction } from './transaction';
import { Plugin, StateField } from './plugin';

import { Block } from '../model/block';
import { Schema } from '../model/schema';

// eslint-disable-next-line @typescript-eslint/ban-types
function bind<T extends Function>(f: T, self?: any): T {
  return !self || !f ? f : f.bind(self);
}

class FieldDesc<T> {
  init: StateField<T>['init'];
  apply: StateField<T>['apply'];

  constructor(
    readonly name: string,
    desc: StateField<T>,
    self?: any,
  ) {
    this.init = bind(desc.init, self);
    this.apply = bind(desc.apply, self);
  }
}

const baseFields = [
  new FieldDesc<EditorState['blocks']>('blocks', {
    init(config) {
      return config.blocks;
    },
    apply(tr) {
      return tr.blocks;
    },
  }),
  new FieldDesc<EditorState['activeId']>('activeId', {
    init() {
      return null;
    },
    apply(tr) {
      return tr.activeId;
    },
  }),
  new FieldDesc<EditorState['lastModifiedBlock']>('lastModifiedBlock', {
    init() {
      return null;
    },
    apply(tr) {
      return tr.lastModifiedBlock;
    },
  }),
];

class Configuration {
  fields: FieldDesc<any>[];
  plugins: Plugin[] = [];
  pluginsByKey: { [key: string]: Plugin } = {};

  constructor(
    readonly schema: Schema,
    plugins?: readonly Plugin[],
  ) {
    this.fields = baseFields.slice();

    if (plugins)
      plugins.forEach((plugin) => {
        if (this.pluginsByKey[plugin.key])
          throw new RangeError(
            `Adding different instances of a keyed plugin "${plugin.key}"`,
          );

        this.plugins.push(plugin);
        this.pluginsByKey[plugin.key] = plugin;

        if (plugin.spec.state)
          this.fields.push(
            new FieldDesc<any>(plugin.key, plugin.spec.state, plugin),
          );
      });
  }
}

export type Blocks = Record<Block['id'], Block>;

export type EditorStateConfig = {
  schema: Schema;
  blocks: Blocks;
  readonly plugins?: Plugin[];
};

export class EditorState {
  blocks!: Blocks;

  activeId!: Block['id'] | null;

  lastModifiedBlock!: Block['id'] | null;

  constructor(
    /// @internal
    readonly config: Configuration,
  ) {}

  get schema(): Schema {
    return this.config.schema;
  }

  get plugins(): readonly Plugin[] {
    return this.config.plugins;
  }

  get propertyConfigurationPlugins() {
    return this.plugins.filter(
      (plugin) => plugin.spec.type === 'property-configuration',
    );
  }

  get activeBlock() {
    if (!this.activeId) return null;

    return this.blocks[this.activeId];
  }

  get blocksArray() {
    return Object.values(this.blocks);
  }

  get rootPage() {
    return this.blocksArray.find((block) => block.type.name === 'page');
  }

  getBlock(id: Block['id']) {
    if (!this.blocks[id])
      throw new Error(`Block with id: ${id} - does not exist.`);

    return this.blocks[id];
  }

  apply(tr: Transaction) {
    return this.applyTransaction(tr).state;
  }

  /// @internal
  filterTransaction(tr: Transaction, ignore = -1) {
    for (let i = 0; i < this.config.plugins.length; i++) {
      if (i != ignore) {
        const plugin = this.config.plugins[i];

        if (
          plugin.spec.filterTransaction &&
          !plugin.spec.filterTransaction.call(plugin, tr, this)
        ) {
          return false;
        }
      }
    }

    return true;
  }

  /// @internal
  applyTransaction(rootTr: Transaction): {
    state: EditorState;
    transactions: readonly Transaction[];
  } {
    if (!this.filterTransaction(rootTr)) {
      return { state: this, transactions: [] };
    }

    const trs = [rootTr];
    let newState = this.applyInner(rootTr);
    let seen = null;

    // This loop repeatedly gives plugins a chance to respond to
    // transactions as new transactions are added, making sure to only
    // pass the transactions the plugin did not see before.

    for (;;) {
      let haveNew = false;

      for (let i = 0; i < this.config.plugins.length; i++) {
        const plugin = this.config.plugins[i];

        if (plugin.spec.appendTransaction) {
          const n = seen ? seen[i].n : 0;
          const oldState = seen ? seen[i].state : this;

          const tr =
            n < trs.length &&
            plugin.spec.appendTransaction.call(
              plugin,
              n ? trs.slice(n) : trs,
              oldState,
              newState,
            );

          if (tr && newState.filterTransaction(tr, i)) {
            tr.setMeta('appendedTransaction', rootTr);

            if (!seen) {
              seen = [];

              for (let j = 0; j < this.config.plugins.length; j++)
                seen.push(
                  j < i
                    ? { state: newState, n: trs.length }
                    : { state: this, n: 0 },
                );
            }

            trs.push(tr);
            newState = newState.applyInner(tr);
            haveNew = true;
          }

          if (seen) {
            seen[i] = { state: newState, n: trs.length };
          }
        }
      }

      if (!haveNew) {
        return { state: newState, transactions: trs };
      }
    }
  }

  get tr() {
    return new Transaction(this);
  }

  /// @internal
  applyInner(tr: Transaction) {
    // check has transactions some patches
    // if (!tr.before.eq(this.blocks))
    //   throw new RangeError('Applying a mismatched transaction');

    const newInstance = new EditorState(this.config);
    const { fields } = this.config;

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      (newInstance as any)[field.name] = field.apply(
        tr,
        (this as any)[field.name],
        this,
        newInstance,
      );
    }

    return newInstance;
  }

  static create(config: EditorStateConfig) {
    const stateConfig = new Configuration(config.schema, config.plugins);

    const instance = new EditorState(stateConfig);

    for (let i = 0; i < stateConfig.fields.length; i++) {
      const name = stateConfig.fields[i].name;

      (instance as any)[name] = stateConfig.fields[i].init(config, instance);
    }

    return instance;
  }

  reconfigure(config: Pick<EditorStateConfig, 'plugins'>) {
    const stateConfig = new Configuration(this.schema, config.plugins);

    const fields = stateConfig.fields;
    const instance = new EditorState(stateConfig);

    for (let i = 0; i < fields.length; i++) {
      const name = fields[i].name;

      (instance as any)[name] = Object.prototype.hasOwnProperty.call(this, name)
        ? (this as any)[name]
        : fields[i].init(
            { ...config, blocks: instance.blocks, schema: instance.schema },
            instance,
          );
    }
    return instance;
  }

  toJSON(): any {
    const result = {
      activeId: this.activeId,
      lastModifiedBlock: this.lastModifiedBlock,
      blocks: Object.values(this.blocks)
        .map((block) => block.toJSON())
        .reduce((acc, block) => {
          acc[block.id] = block;
          return acc;
        }, {}),
    };

    return result;
  }
}
