import { observer } from 'mobx-react-lite';

import { EngineProvider, useEngine, Engine } from '@chameleon/react-engine';
import { Renderer } from '@chameleon/renderer';

import { Sidebar } from './sidebar';

const Content = observer(() => {
  const engine = useEngine();

  return (
    <div className="p-4 w-full">
      {engine.pagesArray.map((page) => (
        <h1 key={page.id} className="text-3xl font-semibold mb-4">
          {page.title}
        </h1>
      ))}

      <Renderer engine={engine} />
    </div>
  );
});

const engine = new Engine();

export const PageEditor = () => {
  return (
    <EngineProvider value={engine}>
      <div className="flex">
        <Sidebar />

        <Content />
      </div>
    </EngineProvider>
  );
};
