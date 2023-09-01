import { Command } from '../command-manager';

import { BlockId, EventName, StateContext } from '../types';
import { isClickableBlock } from '../utils';

export function createAddEventListenerCommand(
  target: BlockId,
  eventName: EventName,
  callbackKey: string,
): Command<StateContext> {
  let oldValue: string | undefined = undefined;

  return {
    execute(context) {
      const block = context.blocks[target];

      // TODO: refactor
      if (eventName === 'onClick') {
        if (isClickableBlock(block)) {
          oldValue = block.props.events.onClick;
          block.props.events.onClick = callbackKey;
        }
      }
    },
    undo(context) {
      const block = context.blocks[target];

      // TODO: refactor
      if (eventName === 'onClick') {
        if (isClickableBlock(block)) {
          block.props.events.onClick = oldValue;
        }
      }
    },
  };
}
