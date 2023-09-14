import { createContext, useContext } from 'react';

import { EditorUIState, PropertiesOverlay } from '@chameleon/editor-core';

export type Editor = {
  ui: EditorUIState;
  components: {
    PropertiesOverlay: PropertiesOverlay;
  };
};

const editorContext = createContext<Editor | null>(null);

export const EditorProvider = editorContext.Provider;

export function useEditor() {
  const value = useContext(editorContext);

  if (!value) throw new Error(`Value not passed to "EditorProvider".`);

  return value;
}
