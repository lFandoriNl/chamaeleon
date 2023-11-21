import { Editor } from '@chamaeleon/core';
import { EditorProvider } from '@chamaeleon/react-editor';
import { Persist } from '@chamaeleon/plugin-persist';
import { History } from '@chamaeleon/plugin-history';

import { ChamaeleonDevtools } from '@chamaeleon/devtools';

import { AddBlockMenu } from './plugins/add-block-menu';
import { ConfigurationDrawer } from './plugins/configuration-drawer';
import { Page } from './plugins/page';
import { Row } from './plugins/row';
import { Column } from './plugins/column';
import { ColumnsTemplate } from './plugins/columns-template';
import { Button as ButtonPlugin } from './plugins/button';

import { Builder } from './builder';

import { connectToReduxDevtools } from './connect-to-redux-devtools';
import { Flex } from '@mantine/core';

const editor = new Editor({
  plugins: [
    Persist({
      // expireIn: 1 * 60 * 1000,
    }),
    History({ limit: 100 }),
    AddBlockMenu(),
    ConfigurationDrawer(),
    Page(),
    Row(),
    Column(),
    ColumnsTemplate(),
    ButtonPlugin(),
    // GridPack,
    // Text(),
  ],
  loggers: [
    ChamaeleonDevtools.logger,
    {
      ...console,
      action: (data) => console.log(data),
      system: (data) => console.log(data),
    },
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
      <Flex direction="column">
        <Builder />
      </Flex>

      <ChamaeleonDevtools.Render />
    </EditorProvider>
  );
};
