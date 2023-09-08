import { observer } from 'mobx-react-lite';

import { EngineProvider, useEngine, Engine } from '@chameleon/react-engine';
import { Renderer, EditorRenderer } from '@chameleon/renderer';

import { Sidebar } from './sidebar';
import { AppBar } from './app-bar';

import { editorModel } from './model/editor-model';

const Content = observer(() => {
  const engine = useEngine();

  return (
    <div className="p-4">
      {engine.pagesArray.map((page) => (
        <h1 key={page.id} className="text-3xl font-semibold mb-4">
          {page.title}
        </h1>
      ))}

      {editorModel.renderMode === 'preview' ? (
        <Renderer engine={engine} />
      ) : (
        <EditorRenderer engine={engine} />
      )}
    </div>
  );
});

const engine = new Engine();

// @ts-expect-error
window.engine = engine;

export const PageEditor = () => {
  return (
    <EngineProvider value={engine}>
      <div className="flex">
        <Sidebar />

        <div className="w-full">
          <AppBar />

          <Content />
        </div>
      </div>
    </EngineProvider>
  );
};
