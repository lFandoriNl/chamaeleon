import { useEffect, useReducer, useRef } from 'react';

import { Editor, EditorEvents } from '@chameleon/core';

import { useEditor } from './context';

export const useEditorSelector = <T>(
  selector: (dataUpdated: EditorEvents['update']) => T,
): [T, Editor] => {
  const [_, rerender] = useReducer((i) => i + 1, 0);

  const editor = useEditor();

  const selectorResultRef = useRef<T>(
    selector({ editor, transaction: editor.state.tr }),
  );

  useEffect(() => {
    const update = (dataUpdated: EditorEvents['update']) => {
      const value = selector(dataUpdated);

      if (selectorResultRef.current !== value) {
        rerender();
      }

      selectorResultRef.current = value;
    };

    editor.on('update', update);

    return () => {
      editor.off('update', update);
    };
  }, []);

  return [selectorResultRef.current, editor];
};
