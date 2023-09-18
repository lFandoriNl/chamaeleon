import { useState } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';

import { AiOutlineBorderLeft, AiOutlineBorderRight } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';

import { IconButton } from '@chameleon/uikit';

import { Editor } from '@chameleon/core';
import {
  EditorProvider,
  useEditor,
  EditorContent,
} from '@chameleon/react-editor';

import { Sidebar } from './sidebar';
import { AppBar } from './app-bar';

import { BlockPropertiesWidget } from '../../widgets/block-properties-widget';

import { Drawer } from '../../shared/ui/drawer';

// const DrawerBlockSettingsWidget = observer(() => {
//   const editor = useEditor();

//   const [direction, setDirection] = useState<'left' | 'right'>('right');

//   return (
//     <Drawer
//       className="top-[40%]"
//       open={editor.ui.blockSettings.isOpen}
//       onClose={() => editor.ui.closeBlockSettings()}
//       direction={direction}
//       enableOverlay={true}
//     >
//       <BlockPropertiesWidget
//         extra={
//           <div>
//             <IconButton
//               className={clsx('!p-1 !shadow-none rounded-none border', {
//                 '!bg-slate-200': direction === 'left',
//               })}
//               onClick={() => setDirection('left')}
//             >
//               <AiOutlineBorderLeft size={24} />
//             </IconButton>

//             <IconButton
//               className={clsx('!p-1 !shadow-none rounded-none border', {
//                 '!bg-slate-200': direction === 'right',
//               })}
//               onClick={() => setDirection('right')}
//             >
//               <AiOutlineBorderRight size={24} />
//             </IconButton>

//             <IconButton
//               className="ml-4 !shadow-none"
//               onClick={() => editor.ui.closeBlockSettings()}
//             >
//               <IoMdClose size={24} />
//             </IconButton>
//           </div>
//         }
//       />
//     </Drawer>
//   );
// });

const Content = observer(() => {
  const editor = useEditor();

  return (
    <div className="border">
      {/* {engine.pagesArray.map((page) => (
        <h1 key={page.id} className="text-3xl font-semibold mb-4">
          {page.title}
        </h1>
      ))} */}

      <EditorContent editor={editor} />

      {/* {editor.ui.renderMode === 'preview' ? (
        <Renderer engine={engine} />
      ) : (
        <EditorRenderer editor={editor} engine={engine} />
      )} */}
    </div>
  );
});

Content.displayName = 'Content';

const editor = new Editor();

editor.commands.addPage(null);
editor.commands.select();

editor.commands.addRow(editor.state.activeId!);
editor.commands.select();

editor.commands.addColumn(editor.state.activeId!);
editor.commands.select();

editor.commands.addText(editor.state.activeId!, { value: 'Some Text' });
editor.commands.select();

// @ts-expect-error
window.editor = editor;

export const PageEditor = () => {
  return (
    <EditorProvider value={editor}>
      <div className="flex">
        <Sidebar />

        <div className="w-full">
          <AppBar />

          <Content />
        </div>
      </div>

      {/* <DrawerBlockSettingsWidget /> */}
    </EditorProvider>
  );
};
