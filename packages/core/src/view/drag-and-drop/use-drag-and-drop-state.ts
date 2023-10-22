import { useEffect, useReducer, useRef } from 'react';
import { DragAndDropState } from './drag-and-drop-state';
import { useEditorInstance } from '../use-editor-instance';

type Selector<T> = (state: DragAndDropState) => T;

export function useDragAndDropState(): DragAndDropState;

export function useDragAndDropState<T>(
  selector: Selector<T>,
): [T, DragAndDropState];

export function useDragAndDropState<T>(
  selector?: Selector<T>,
): [T, DragAndDropState] | DragAndDropState {
  const { view } = useEditorInstance();

  const { state } = view.dragAndDrop;

  if (!selector) {
    return state;
  }

  const [_, rerender] = useReducer((i) => i + 1, 0);

  const selectorResultRef = useRef<T>(selector(state));

  useEffect(() => {
    const update = (state: DragAndDropState) => {
      const value = selector(state);

      if (selectorResultRef.current !== value) {
        rerender();
      }

      selectorResultRef.current = value;
    };

    state.on('update', update);

    return () => {
      state.off('update', update);
    };
  }, []);

  return [selectorResultRef.current, state];
}
