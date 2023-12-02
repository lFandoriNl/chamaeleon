import { useEditorSelector } from '@chamaeleon/react-editor';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { SurveyForm } from './survey-form';

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
