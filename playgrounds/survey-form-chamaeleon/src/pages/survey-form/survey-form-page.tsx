import { useEditor } from '@chamaeleon/react-editor';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SurveyForm } from './survey-form';

export function SurveyFormPage() {
  const editor = useEditor();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Paper sx={{ p: 4 }}>
          {/* <Typography variant="h5">Survey form</Typography> */}

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5">Survey form</Typography>

            <ButtonGroup variant="outlined">
              <Button onClick={editor.commands.undo}>
                <UndoIcon />
              </Button>

              <Button onClick={editor.commands.redo}>
                <RedoIcon />
              </Button>
            </ButtonGroup>
          </Stack>
        </Paper>

        <SurveyForm />
      </Stack>
    </Container>
  );
}
