import { BlockId, EventName } from './types';

export function createListenersRegistry() {
  const listeners: Record<string, string> = {};

  const set = (blockId: BlockId, eventName: EventName, actionRaw: string) => {
    const listenerId = `${blockId}-${eventName}`;
    listeners[listenerId] = actionRaw;

    return listenerId;
  };

  const get = (listenerId: string) => {
    return listeners[listenerId];
  };

  return {
    set,
    get,
  };
}
