import { EditorContent, useEditor } from '@chamaeleon/react-editor';
import { Button, Paper, Stack } from '@mui/material';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

type FormState = {
  [key: string]: any;
};

export function SurveyForm() {
  const editor = useEditor();

  const methods = useForm<FormState>();

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormState> = (data) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <Stack component="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
        <EditorContent editor={editor} empty={<AddRootBlock />} />
      </Stack>
    </FormProvider>
  );
}

function AddRootBlock() {
  const editor = useEditor();

  return (
    <Paper
      sx={{
        p: 4,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Button
        variant="contained"
        onClick={() => {
          editor.commands.insertRootContent({
            id: editor.schema.spec.rootBlockId,
            type: 'root',
          });
        }}
      >
        Add root block
      </Button>
    </Paper>
  );
}
