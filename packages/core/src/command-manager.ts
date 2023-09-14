import { Editor } from './editor';
import { CommandProps, RawCommands, SingleCommands } from './types';

export class CommandManager {
  editor: Editor;

  rawCommands: RawCommands;

  // changes = new Map<
  //   number,
  //   {
  //     redo: Patch[];
  //     undo: Patch[];
  //   }
  // >();

  // private currentVersion = -1;
  // private supportedVersions = 10;

  // canRedo = false;
  // canUndo = false;

  constructor(props: { editor: Editor }) {
    this.editor = props.editor;

    this.rawCommands = this.editor.extensionManager.commands;
  }

  get commands(): SingleCommands {
    const props = this.buildProps();

    return Object.fromEntries(
      Object.entries(this.rawCommands).map(([name, command]) => {
        const method = (...args: any[]) => {
          // @ts-expect-error
          const callback = command(...args)(props);

          return callback;
        };

        return [name, method];
      }),
    ) as unknown as SingleCommands;

    // const { rawCommands, editor, state } = this;
    // const { view } = editor;
    // const { tr } = state;
    // const props = this.buildProps(tr);

    // return Object.fromEntries(
    //   Object.entries(rawCommands).map(([name, command]) => {
    //     const method = (...args: any[]) => {
    //       const callback = command(...args)(props);

    //       if (!tr.getMeta('preventDispatch') && !this.hasCustomState) {
    //         view.dispatch(tr);
    //       }

    //       return callback;
    //     };

    //     return [name, method];
    //   }),
    // ) as unknown as SingleCommands;
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

  buildProps(): CommandProps {
    const { rawCommands, editor } = this;
    const { tr } = editor.state;

    const props: CommandProps = {
      tr,
      editor,
      view: editor.view,
      state: editor.state,
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
