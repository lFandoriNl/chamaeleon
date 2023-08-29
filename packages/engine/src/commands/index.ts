import { createSetPageRootBlockCommand } from './set-page-root-block-command';
import { createAddPageRootBlockCommand } from './add-main-page-block-command';
import { createAddBlockCommand } from './add-block-command';
import { createChangeContentCommand } from './create-change-content-command';
import { createAddEventListenerCommand } from './add-event-listener-command';

export const commands = {
  createSetPageRootBlockCommand,
  createAddPageRootBlockCommand,
  createAddBlockCommand,
  createChangeContentCommand,
  createAddEventListenerCommand,
};
