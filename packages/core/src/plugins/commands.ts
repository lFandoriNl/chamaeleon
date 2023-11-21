import * as commands from '../commands';
import { Plugin } from '../state';

export function Commands(): Plugin {
  return {
    name: 'commands',
    apply(_, methods) {
      methods.addCommands(commands);
    },
  };
}
