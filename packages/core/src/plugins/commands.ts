import { Plugin } from '../state';
import * as commands from '../commands';

export function Commands(): Plugin {
  return {
    name: 'commands',
    apply(_, methods) {
      methods.addCommands(commands);
    },
  };
}
