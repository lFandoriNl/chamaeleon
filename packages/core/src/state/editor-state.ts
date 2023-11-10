import { Transaction } from './transaction';
import { Plugin, StateField } from './plugin';

import { Block, Fragment, Schema } from '../model';

import { JSONContent } from '../types';

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
      return Object.fromEntries(
        Object.entries(config.blocks).map(([id, rawBlock]) => {
          return [
            id,
            config.schema.block(
              rawBlock.type,
              rawBlock.props,
              rawBlock.style,
              Fragment.fromJSON(config.schema, rawBlock.content),
              rawBlock.id,
            ),
          ];
        }),
      );
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
  pluginsByName: { [key: string]: Plugin } = {};

  constructor(
    readonly schema: Schema,
    plugins?: readonly Plugin[],
  ) {
    this.fields = baseFields.slice();

    if (plugins)
      plugins.forEach((plugin) => {
        if (this.pluginsByName[plugin.name])
          throw new RangeError(
            `Adding different instances of a keyed plugin "${plugin.name}"`,
          );

        this.plugins.push(plugin);
        this.pluginsByName[plugin.name] = plugin;

        if (plugin.state)
          this.fields.push(
            new FieldDesc<any>(plugin.name, plugin.state, plugin),
          );
      });
  }
}

export type RawBlocks = Record<Block['id'], JSONContent>;

export type Blocks = Record<Block['id'], Block>;

export type EditorStateConfig = {
  schema: Schema;
  blocks: RawBlocks;
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

  get activeBlock() {
    if (!this.activeId) return null;

    return this.blocks[this.activeId];
  }

  get rootPage() {
    return this.blocks[this.schema.spec.rootBlockId];
  }

  /// @internal
  getPluginState<T>(name: Plugin['name']): T {
    return (this as any)[name] as T;
  }

  /// @internal
  setPluginState<T>(name: Plugin['name'], state: T) {
    (this as any)[name] = state;
  }

  getBlock(id: Block['id']) {
    if (!this.blocks[id])
      throw new RangeError(`Block with id: ${id} - does not exist.`);

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
          plugin.filterTransaction &&
          !plugin.filterTransaction.call(plugin, tr, this)
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

        if (plugin.appendTransaction) {
          const n = seen ? seen[i].n : 0;
          const oldState = seen ? seen[i].state : this;

          const tr =
            n < trs.length &&
            plugin.appendTransaction.call(
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

    const { fields } = this.config;

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      (this as any)[field.name] = field.apply(
        tr,
        (this as any)[field.name],
        this,
        this,
      );
    }

    return this;
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
            {
              ...config,
              blocks: instance.toJSON().blocks,
              schema: instance.schema,
            },
            instance,
          );
    }

    return instance;
  }

  fromJSON(
    json: any,
  ): { success: true; state: EditorState } | { success: false } {
    try {
      return {
        success: true,
        state: EditorState.create({
          blocks: json.blocks,
          schema: this.config.schema,
          plugins: this.config.plugins,
        }),
      };
    } catch (error) {
      return {
        success: false,
      };
    }
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
