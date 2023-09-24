import { Command, RawCommands } from '../types';

declare module '..' {
  interface Commands<ReturnType> {
    command: {
      command: (fn: (props: Parameters<Command>[0]) => void) => ReturnType;
    };
  }
}

export const command: RawCommands['command'] = (fn) => (props) => {
  fn(props);
};
