import { Editor } from './editor';
import { Transaction } from './state';

import { createChainableState } from './helpers/create-chainable-state';

import {
  ChainedCommands,
  CommandProps,
  RawCommands,
  SingleCommands,
} from './types';

export class CommandManager {
  editor: Editor;

  rawCommands: RawCommands;

  constructor(props: { editor: Editor }) {
    this.editor = props.editor;

    this.rawCommands = this.editor.extensionManager.commands;
  }

  get commands(): SingleCommands {
    const { view, state } = this.editor;

    const props = this.buildProps(state.tr);

    return Object.fromEntries(
      Object.entries(this.rawCommands).map(([name, command]) => {
        const method = (...args: any[]) => {
          // @ts-expect-error
          const callback = command(...args)(props);

          view.dispatch(props.tr);

          return callback;
        };

        return [name, method];
      }),
    ) as unknown as SingleCommands;
  }

  get chain(): () => ChainedCommands {
    return () => this.createChain();
  }

  private createChain(startTr?: Transaction): ChainedCommands {
    const { rawCommands, editor } = this;
    const { view } = editor;

    const hasStartTransaction = Boolean(startTr);
    const tr = startTr || editor.state.tr;

    const callbacks: void[] = [];

    const run = () => {
      if (!hasStartTransaction) {
        view.dispatch(tr);
      }
    };

    const chain = {
      ...Object.fromEntries(
        Object.entries(rawCommands).map(([name, command]) => {
          const chainedCommand = (...args: never[]) => {
            const props = this.buildProps(tr);

            // @ts-expect-error
            const callback = command(...args)(props);

            callbacks.push(callback);

            return chain;
          };

          return [name, chainedCommand];
        }),
      ),
      run,
    } as unknown as ChainedCommands;

    return chain;
  }

  // execute(str: string) {
  //   const [patches, inversePatches] = this.editor.state.apply((state) => {
  //     const id = Object.keys(state.pages)[0];
  //     state.pages[id].title = str;
  //   });

  //   this.changes.set(++this.currentVersion, {
  //     redo: patches,
  //     undo: inversePatches,
  //   });

  //   this.changes.delete(this.currentVersion + 1);
  //   this.changes.delete(this.currentVersion - this.supportedVersions);

  //   this.canRedo = false;
  //   this.canUndo = true;
  // }

  // redo() {
  //   const patches = this.changes.get(++this.currentVersion);

  //   if (!patches) return;

  //   this.editor.state.apply((state) => {
  //     applyPatches(state, patches.redo);
  //   });

  //   this.canRedo = this.changes.has(this.currentVersion + 1);
  //   this.canUndo = true;
  // }

  // undo() {
  //   const patches = this.changes.get(this.currentVersion--);

  //   if (!patches) return;

  //   this.editor.state.apply((state) => {
  //     applyPatches(state, patches.undo);
  //   });

  //   this.canRedo = true;
  //   this.canUndo = this.changes.has(this.currentVersion);
  // }

  buildProps(tr: Transaction): CommandProps {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    const { rawCommands, editor } = this;

    const props: CommandProps = {
      tr,
      editor,
      view: editor.view,
      state: createChainableState({
        state: editor.state,
        transaction: tr,
      }),
      get chain() {
        return self.createChain(tr);
      },
      get commands() {
        return Object.fromEntries(
          Object.entries(rawCommands).map(([name, command]) => {
            // @ts-expect-error
            return [name, (...args: never[]) => command(...args)(props)];
          }),
        ) as unknown as SingleCommands;
      },
    };

    return props;
  }
}

// export function createCommandManager<T>(target: T) {
//   let history: Command<T>[] = [emptyCommand];
//   let position = 0;

//   const getValue = () => {
//     return target;
//   };

//   const execute = (command: Command<T>) => {
//     if (position < history.length - 1) {
//       history = history.slice(0, position + 1);
//     }

//     history.push(command);
//     position += 1;

//     command.execute(target) as T;
//   };

//   const redo = () => {
//     if (position < history.length - 1) {
//       position += 1;
//       history[position].execute(target) as T;
//     }
//   };

//   const undo = () => {
//     if (position > 0) {
//       history[position].undo(target) as T;
//       position -= 1;
//     }
//   };

//   return {
//     getValue,
//     execute,
//     redo,
//     undo,
//   };
// }
