import { createAddPageRootBlockCommand } from './add-page-root-block-command';
import { createAddBlockCommand } from './add-block-command';
import { createChangeContentCommand } from './create-change-content-command';
import { createAddEventListenerCommand } from './add-event-listener-command';

export function createCommandRegistry() {
  const commands = {
    createAddPageRootBlockCommand,
    createAddBlockCommand,
    createChangeContentCommand,
    createAddEventListenerCommand,
  };

  return commands;
}
