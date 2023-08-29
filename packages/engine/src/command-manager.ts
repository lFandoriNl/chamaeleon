export interface Command<T> {
  execute(context: T): unknown;
  undo(context: T): unknown;
}

export type CommandManager<T> = ReturnType<typeof createCommandManager<T>>;

const emptyCommand = {
  execute() {},
  undo() {},
};

export function createCommandManager<T>(target: T) {
  let history: Command<T>[] = [emptyCommand];
  let position = 0;

  const getValue = () => {
    return target;
  };

  const execute = (command: Command<T>) => {
    if (position < history.length - 1) {
      history = history.slice(0, position + 1);
    }

    history.push(command);
    position += 1;

    command.execute(target) as T;
  };

  const redo = () => {
    if (position < history.length - 1) {
      position += 1;
      history[position].execute(target) as T;
    }
  };

  const undo = () => {
    if (position > 0) {
      history[position].undo(target) as T;
      position -= 1;
    }
  };

  return {
    getValue,
    execute,
    redo,
    undo,
  };
}
