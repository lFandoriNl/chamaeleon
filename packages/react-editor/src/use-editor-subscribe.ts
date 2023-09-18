import { useEffect, useState, useRef } from 'react';

import { Editor, EditorEvents } from '@chameleon/core';

import { useEditor } from './context';

export const useEditorSelector = <T>(
  selector: (dataUpdated: EditorEvents['update']) => T,
): T => {
  const [_, rerender] = useState(0);

  const editor = useEditor();

  const selectorResultRef = useRef<T>(
    selector({ editor, transaction: editor.state.tr }),
  );

  useEffect(() => {
    const update = (dataUpdated: EditorEvents['update']) => {
      const value = selector(dataUpdated);

      if (selectorResultRef.current !== value) {
        rerender((i) => i + 1);
      }

      selectorResultRef.current = value;
    };

    editor.on('update', update);

    return () => {
      editor.off('update', update);
    };
  }, []);

  return selectorResultRef.current;
};
