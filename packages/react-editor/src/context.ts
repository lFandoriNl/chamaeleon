import { type Editor } from '@chamaeleon/core';
import { createContext, useContext } from 'react';

const editorContext = createContext<Editor | null>(null);

export const EditorProvider = editorContext.Provider;

export function useEditor() {
  const value = useContext(editorContext);

  if (!value) throw new Error('Value not passed to "EditorProvider".');

  return value;
}
