import { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { AiOutlineBorderLeft, AiOutlineBorderRight } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';

import { IconButton } from '@chameleon/uikit';

import {
  EditorProvider,
  EditorUIState,
  useEditor,
} from '@chameleon/react-editor';
import { EngineProvider, useEngine, Engine } from '@chameleon/react-engine';
import { Renderer, EditorRenderer } from '@chameleon/renderer';

import { Sidebar } from './sidebar';
import { AppBar } from './app-bar';
import { BlockSettingsWidget } from '../../widgets/block-settings-widget/block-settings-widget';

import { Drawer } from '../../shared/ui/drawer';
import clsx from 'clsx';

const DrawerBlockSettingsWidget = observer(() => {
  const editor = useEditor();

  const [direction, setDirection] = useState<'left' | 'right'>('right');

  return (
    <Drawer
      className="top-[40%]"
      open={editor.ui.blockSettings.isOpen}
      onClose={() => editor.ui.closeBlockSettings()}
      direction={direction}
      enableOverlay={true}
    >
      <BlockSettingsWidget
        extra={
          <div>
            <IconButton
              className={clsx('!p-1 shadow-none rounded-none border', {
                'bg-slate-200': direction === 'left',
              })}
              onClick={() => setDirection('left')}
            >
              <AiOutlineBorderLeft size={24} />
            </IconButton>

            <IconButton
              className={clsx('!p-1 shadow-none rounded-none border', {
                'bg-slate-200': direction === 'right',
              })}
              onClick={() => setDirection('right')}
            >
              <AiOutlineBorderRight size={24} />
            </IconButton>

            <IconButton
              className="ml-4 shadow-none"
              onClick={() => editor.ui.closeBlockSettings()}
            >
              <IoMdClose size={24} />
            </IconButton>
          </div>
        }
      />
    </Drawer>
  );
});

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

        <DrawerBlockSettingsWidget />
      </EngineProvider>
    </EditorProvider>
  );
};
