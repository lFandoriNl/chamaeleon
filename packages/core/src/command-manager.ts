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

    this.rawCommands = this.editor.pluginManager.commands;
  }

  get commands(): SingleCommands {
    const { view, state } = this.editor;

    const props = this.buildProps(state.tr);

    const { tr } = props;

    return Object.fromEntries(
      Object.entries(this.rawCommands).map(([name, command]) => {
        const method = (...args: any[]) => {
          // @ts-expect-error
          const callback = command(...args)(props);

          if (!tr.getMeta('preventDispatch')) {
            view.dispatch(tr);
          }

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
      if (!hasStartTransaction && !tr.getMeta('preventDispatch')) {
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
