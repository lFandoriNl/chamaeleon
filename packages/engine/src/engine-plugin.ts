declare abstract class EnginePlugin<I = unknown, D = unknown> {
  createInterface?(ø: Record<string, unknown>): I;
  getDependencies?(): D;
}

type Defined<T> = T extends undefined ? never : T;

type ExtractPlugins<T> = T extends Engine<infer PX> ? PX : never;

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type MergeInterfaces<
  E extends Engine,
  K extends keyof EnginePlugin,
> = UnionToIntersection<ReturnType<Defined<ExtractPlugins<E>[number][K]>>>;

type Assume<T, U> = T extends U ? T : never;

type GetDependencies<P extends EnginePlugin> = Assume<
  P extends EnginePlugin<unknown, infer D> ? D : never,
  EnginePlugin[]
>;

type PluginDependencyErrorMessage =
  `Plugin is missing one or more dependencies.`;

type EnforceDependencies<
  E extends Engine,
  P extends EnginePlugin,
> = GetDependencies<P>[number] extends ExtractPlugins<E>[number]
  ? P
  : PluginDependencyErrorMessage;

// declare class Engine<PX extends EnginePlugin[] = []> {
//   registerPlugin<P extends EnginePlugin>(
//     plugin: EnforceDependencies<this, P>,
//   ): asserts this is Engine<[...PX, P]>;

//   createInterface(): MergeInterfaces<this, 'createInterface'>;
// }

class Engine<PX extends EnginePlugin[] = []> {
  plugins: EnginePlugin<unknown, unknown>[] = [];

  registerPlugin<P extends EnginePlugin>(
    plugin: EnforceDependencies<this, P>,
  ): Engine<[...PX, P]> {
    this.plugins.push(plugin);

    return this;
  }

  createInterface(): MergeInterfaces<this, 'createInterface'> {
    return this;
  }

  getBlocks(): ReturnType<ExtractPlugins<this>[number]['createInterface']> {
    return this.plugins.map((p) => p.createInterface({}).type);
  }
}

// interface DogInterface {
//   bark(): void;
// }

// declare const DogPlugin: {
//   new (): {
//     createInterface(ø: Record<string, unknown>): DogInterface;
//   };
//   (ø: unknown): ø is DogInterface;
// };

// interface CatInterface {
//   meow(message: string): void;
// }

// declare const CatPlugin: {
//   new (): {
//     super(): typeof CatPlugin;
//     createInterface(ø: Record<string, unknown>): CatInterface;
//   };
//   (ø: unknown): ø is CatInterface;
// };

// interface PantherInterface {
//   panther: {
//     roar(): void;
//   };
// }

// declare const PantherPlugin: {
//   new (): {
//     createInterface(ø: Record<string, unknown>): PantherInterface;
//   };
//   getDependencies(): [typeof CatPlugin];
//   (ø: unknown): ø is PantherInterface;
// };

type RowInterface = {
  type: 'row';
};

class RowPlugin extends EnginePlugin<RowInterface> {
  createInterface(instance: Record<string, unknown>): RowInterface {
    return {
      type: 'row',
    };
  }

  getDependencies(): unknown {
    throw new Error('Method not implemented.');
  }
}

type ColumnInterface = {
  type: 'column';
};

class ColumnPlugin extends EnginePlugin<ColumnInterface> {
  createInterface(instance: Record<string, unknown>): ColumnInterface {
    return {
      type: 'column',
    };
  }

  getDependencies(): unknown {
    throw new Error('Method not implemented.');
  }
}

declare const engine: Engine;

const engine1 = engine
  .registerPlugin(new RowPlugin())
  .registerPlugin(new ColumnPlugin());

const ø = engine1.getBlocks();

newEngine.ø.bark();
ø.meow('hello');
ø.panther.roar();

ø.meow('meow');

// if (DogPlugin(ø)) {
//   ø.bark();
// }
