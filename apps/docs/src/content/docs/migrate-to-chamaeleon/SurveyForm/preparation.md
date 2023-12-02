---
title: Preparation
description: Preparing to start developing plugins
sidebar:
  order: 1
---

## Installation

Let's install the chameleon core and the react integration package:

```sh frame="none"
npm i @chamaeleon/core @chamaeleon/react-editor
```

As well as plugins for undo redo operations and persistent state:

```sh frame="none"
npm i @chamaeleon/plugin-history @chamaeleon/plugin-persist
```

## Creating an Editor instance

Let's create an editor instance in the `demo.tsx` file, and wrap our application in `EditorProvider`

```tsx
// demo.tsx
import { Editor } from '@chamaeleon/core';
import { History } from '@chamaeleon/plugin-history';
import { Persist } from '@chamaeleon/plugin-persist';
import { EditorProvider } from '@chamaeleon/react-editor';

import { SurveyFormPage } from './pages/survey-form/survey-form-page';

const editor = new Editor({
  plugins: [Persist(), History()],
});

export const Demo = () => {
  return (
    <EditorProvider value={editor}>
      <SurveyFormPage />
    </EditorProvider>
  );
};
```

As you can see, during creation we can expand the capabilities of our editor using plugins, as we did with `persist` and `history`

Let's create a toolbar for undo redo operations and change the editor mode

```tsx
// pages/survey-form/survey-form-page.tsx
export function SurveyFormPage() {
  const [isViewMode, editor] = useEditorSelector(
    ({ editor }) => editor.mode === 'view',
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Paper sx={{ p: 4 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5">Survey form</Typography>

            <Box display="flex">
              <FormControlLabel
                control={
                  <Switch
                    value={isViewMode}
                    onChange={(_, checked) => {
                      editor.changeMode(checked ? 'view' : 'editor');
                    }}
                  />
                }
                label={isViewMode ? 'View mode' : 'Editor mode'}
              />

              <ButtonGroup variant="outlined">
                <Button onClick={editor.commands.undo}>
                  <UndoIcon />
                </Button>

                <Button onClick={editor.commands.redo}>
                  <RedoIcon />
                </Button>
              </ButtonGroup>
            </Box>
          </Stack>
        </Paper>

        <SurveyForm />
      </Stack>
    </Container>
  );
}
```

Next we will need to develop our own plugins that will include the building blocks for the editor; we will consider the decomposition of these blocks in the next article
