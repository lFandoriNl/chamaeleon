import { Editor } from '@chamaeleon/core';
import { History } from '@chamaeleon/plugin-history';
import { Persist } from '@chamaeleon/plugin-persist';
import { EditorProvider } from '@chamaeleon/react-editor';

import { connectToReduxDevtools } from './connect-to-redux-devtools';
import { SurveyFormPage } from './pages/survey-form/survey-form-page';

const editor = new Editor({
  plugins: [
    Persist({
      // expireIn: 1 * 60 * 1000,
    }),
    History({ limit: 100 }),
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
      <SurveyFormPage />
    </EditorProvider>
  );
};
