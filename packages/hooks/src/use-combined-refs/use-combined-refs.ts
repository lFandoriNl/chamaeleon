import { Ref, useCallback } from 'react';

export function useCombinedRefs<T>(...refs: Array<Ref<T>>): Ref<T> {
  return useCallback(
    (element: T) =>
      refs.forEach((ref) => {
        if (!ref) {
          return;
        }

        if (typeof ref === 'function') {
          return ref(element);
        }

        // As per https://github.com/facebook/react/issues/13029
        // it should be fine to set current this way.
        (ref as any).current = element;
      }),
    refs,
  );
}
