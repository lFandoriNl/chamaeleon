import { RefObject } from 'react';

import { useEventListener } from './use-event-listener';

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent) => void,
  mouseEvent: 'mousedown' | 'mouseup' = 'mousedown',
) {
  useEventListener(mouseEvent, (event) => {
    const element = ref?.current;

    if (!element || element.contains(event.target as Node)) {
      return;
    }

    handler(event);
  });
}
