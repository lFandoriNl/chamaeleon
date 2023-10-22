import { createContext, useContext } from 'react';

import { Editor } from '../editor';

export const EditorInstanceContext = createContext<Editor | null>(null);

export const useEditorInstance = () => {
  const editor = useContext(EditorInstanceContext);

  if (!editor) {
    throw new Error('Value not passed to "EditorInstanceContext.Provider".');
  }

  return editor;
};
