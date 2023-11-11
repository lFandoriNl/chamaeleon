import { Editor } from '@chamaeleon/core';
import { Page } from '@chamaeleon/plugin-page';
import { GridPack } from '@chamaeleon/plugin-grid';
import { Text } from '@chamaeleon/plugin-typography';
import { Persist } from '@chamaeleon/plugin-persist';
import { History } from '@chamaeleon/plugin-history';
import { AddBlockMenu } from '@chamaeleon/plugin-add-block-menu';
import { ConfigurationDrawer } from '@chamaeleon/plugin-configuration-drawer';
import { EditorProvider } from '@chamaeleon/react-editor';

import { ChamaeleonDevtools } from '@chamaeleon/devtools';

import { Button as ButtonPlugin } from './plugins/button';

import { Builder } from './builder';

import { connectToReduxDevtools } from './connect-to-redux-devtools';

const editor = new Editor({
  plugins: [
    Persist({
      // expireIn: 1 * 60 * 1000,
    }),
    History({ limit: 100 }),
    AddBlockMenu(),
    ConfigurationDrawer(),
    Page(),
    GridPack,
    Text(),
    ButtonPlugin(),
  ],
  loggers: [
    ChamaeleonDevtools.logger,
    // {
    //   ...console,
    //   action: (data) => console.log(data),
    //   system: (data) => console.log(data),
    // },
  ],
});

connectToReduxDevtools(editor);

editor.on('update', ({ transaction }) => {
  console.log('update', {
    transaction,
    lastModifiedBlock: transaction.lastModifiedBlock,
    activeId: transaction.activeId,
    activeBlock: {
      id: transaction.activeBlock?.id,
      name: transaction.activeBlock?.type.name,
      children: transaction.activeBlock?.children.children,
    },
    blocks: Object.values(transaction.blocks).map((block) => ({
      id: block.id,
      name: block.type.name,
      props: block.props,
      style: block.style,
      children: block.children,
    })),
  });
});

export const Example = () => {
  return (
    <EditorProvider value={editor}>
      <div className="flex flex-col">
        <Builder />
      </div>

      <ChamaeleonDevtools.Render />
    </EditorProvider>
  );
};
