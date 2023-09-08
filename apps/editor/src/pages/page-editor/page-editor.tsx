import { observer } from 'mobx-react-lite';

import {
  EditorProvider,
  EditorUIState,
  useEditor,
} from '@chameleon/react-editor';
import { EngineProvider, useEngine, Engine } from '@chameleon/react-engine';
import { Renderer, EditorRenderer } from '@chameleon/renderer';

import { Sidebar } from './sidebar';
import { AppBar } from './app-bar';

const Content = observer(() => {
  const editor = useEditor();
  const engine = useEngine();

  return (
    <div className="p-4">
      {engine.pagesArray.map((page) => (
        <h1 key={page.id} className="text-3xl font-semibold mb-4">
          {page.title}
        </h1>
      ))}

      {editor.ui.renderMode === 'preview' ? (
        <Renderer engine={engine} />
      ) : (
        <EditorRenderer editor={editor} engine={engine} />
      )}
    </div>
  );
});

const engine = new Engine();

// @ts-expect-error
window.engine = engine;

export const PageEditor = () => {
  return (
    <EditorProvider
      value={{
        ui: new EditorUIState(),
      }}
    >
      <EngineProvider value={engine}>
        <div className="flex">
          <Sidebar />

          <div className="w-full">
            <AppBar />

            <Content />
          </div>
        </div>
      </EngineProvider>
    </EditorProvider>
  );
};
