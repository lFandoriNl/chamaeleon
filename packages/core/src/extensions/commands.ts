import * as commands from '../commands';

import { Extension } from '../extension';

export const Commands = Extension.create({
  name: 'commands',

  addCommands() {
    return {
      ...commands,
    };
  },
});
