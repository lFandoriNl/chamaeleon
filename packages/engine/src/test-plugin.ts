// import { addHiddenProp } from 'mobx/dist/internal';

// type Defined<T> = T extends undefined ? never : T;

// type ExtractPlugins<T> = T extends Engine<infer PX> ? PX : never;

// type UnionToIntersection<U> = (
//   U extends unknown ? (k: U) => void : never
// ) extends (k: infer I) => void
//   ? I
//   : never;

// type MergeInterfaces<
//   E extends Engine,
//   K extends keyof EnginePlugin,
// > = UnionToIntersection<ReturnType<Defined<ExtractPlugins<E>[number][K]>>>;

// //

// type Assume<T, U> = T extends U ? T : never;

// type GetDependencies<P extends EnginePlugin> = Assume<
//   P extends EnginePlugin<unknown, infer D> ? D : never,
//   EnginePlugin[]
// >;

// type PluginDependencyErrorMessage =
//   `Plugin is missing one or more dependencies.`;

// type EnforceDependencies<
//   E extends Engine,
//   P extends EnginePlugin,
// > = GetDependencies<P>[number] extends ExtractPlugins<E>[number]
//   ? P
//   : PluginDependencyErrorMessage;

// abstract class EnginePlugin<I = unknown, D = unknown> {
//   createInstance?(instance: Record<string, unknown>): I;
//   getDependencies?(): D;
// }

// type RowInterface = {
//   type: 'row';
// };

// class RowPlugin extends EnginePlugin<RowInterface> {
//   createInstance(instance: Record<string, unknown>): RowInterface {
//     return {
//       type: 'row',
//     };
//   }

//   getDependencies(): unknown {
//     throw new Error('Method not implemented.');
//   }
// }

// type ColumnInterface = {
//   type: 'column';
// };

// class ColumnPlugin extends EnginePlugin<ColumnInterface> {
//   createInstance(instance: Record<string, unknown>): ColumnInterface {
//     return {
//       type: 'column',
//     };
//   }

//   getDependencies(): unknown {
//     throw new Error('Method not implemented.');
//   }
// }

// class Engine<PX extends EnginePlugin[] = []> {
//   plugins: EnginePlugin[] = [];

//   registerPlugin<P extends EnginePlugin>(
//     plugin: P,
//   ): asserts this is Engine<[...PX, P]> {
//     this.plugins.push(plugin);
//   }

//   createInstance(): MergeInterfaces<this, 'createInstance'> {
//     return {};
//   }
// }

// const engine = new Engine();

// engine.registerPlugin(new RowPlugin());

// // engine.registerPlugin(new ColumnPlugin());

// engine.createInstance();
