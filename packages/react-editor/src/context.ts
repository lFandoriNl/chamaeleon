import { createContext, useContext } from 'react';

import { type Editor } from '@chamaeleon/core';

const editorContext = createContext<Editor | null>(null);

export const EditorProvider = editorContext.Provider;

export function useEditor() {
  const value = useContext(editorContext);

  if (!value) throw new Error(`Value not passed to "EditorProvider".`);

  return value;
}
