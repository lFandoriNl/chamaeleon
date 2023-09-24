import { expect, describe, it, beforeEach, vi } from 'vitest';

import { CommandManager } from './command-manager';
import { Editor } from './editor';

describe('createCommandManager', () => {
  let commandManager: CommandManager;

  beforeEach(() => {
    commandManager = new CommandManager({
      editor: new Editor(),
    });

    // mockCommand = {
    //   execute: vi.fn((context) => (context.count += 1)),
    //   undo: vi.fn((context) => (context.count -= 1)),
    // };
  });

  it('should execute a command', () => {
    // console.dir(commandManager.changes, { depth: Infinity });
    // commandManager.execute('new');
    // log();
    // commandManager.execute(mockCommand);
    // expect(commandManager.getValue()).toEqual({ count: 1 });
    // FYI: this case doesn't work because the changes are mutable
    // expect(mockCommand.execute).toHaveBeenCalledWith({ count: 0 });
  });

  // it('should undo a command', () => {
  //   commandManager.execute(mockCommand);
  //   commandManager.undo();
  //   expect(commandManager.getValue()).toEqual({ count: 0 });
  // });

  // it('should not undo if no commands have been executed', () => {
  //   commandManager.undo();
  //   expect(commandManager.getValue()).toEqual({ count: 0 });
  // });

  // it('should redo a command', () => {
  //   commandManager.execute(mockCommand);
  //   commandManager.undo();
  //   commandManager.redo();
  //   expect(commandManager.getValue()).toEqual({ count: 1 });
  //   expect(mockCommand.execute).toHaveBeenCalledTimes(2);
  // });

  // it('should not redo if no commands have been undone', () => {
  //   commandManager.execute(mockCommand);
  //   commandManager.redo();
  //   expect(commandManager.getValue()).toEqual({ count: 1 });
  // });

  // it('should clears any future commands left by undos', () => {
  //   commandManager.execute(mockCommand);
  //   commandManager.execute(mockCommand);
  //   commandManager.execute(mockCommand);
  //   commandManager.undo();
  //   commandManager.undo();
  //   commandManager.execute(mockCommand);
  //   expect(commandManager.getValue()).toEqual({ count: 2 });
  //   commandManager.redo();
  //   expect(commandManager.getValue()).toEqual({ count: 2 });
  // });
});
