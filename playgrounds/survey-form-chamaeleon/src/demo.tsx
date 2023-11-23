import { Editor } from '@chamaeleon/core';
import { History } from '@chamaeleon/plugin-history';
import { Persist } from '@chamaeleon/plugin-persist';
import { EditorProvider } from '@chamaeleon/react-editor';

import { BlockSettings } from './builder/plugins/block-settings';
import { Button } from './builder/plugins/button';
import { ChangeProps } from './builder/plugins/change-props';
import { ChangeStyle } from './builder/plugins/change-style';
import { Paper } from './builder/plugins/paper';
import { Root } from './builder/plugins/root';
import { Stack } from './builder/plugins/stack';
import { Text } from './builder/plugins/text';
import { TextField } from './builder/plugins/text-field';
import { SurveyFormPage } from './pages/survey-form/survey-form-page';

const editor = new Editor({
  plugins: [
    // Persist(),
    History(),
    Root(),
    Paper(),
    Stack(),
    Text(),
    TextField(),
    Button(),
    BlockSettings(),
    ChangeProps(),
    ChangeStyle(),
  ],
});

export const Demo = () => {
  return (
    <EditorProvider value={editor}>
      <SurveyFormPage />
    </EditorProvider>
  );
};
