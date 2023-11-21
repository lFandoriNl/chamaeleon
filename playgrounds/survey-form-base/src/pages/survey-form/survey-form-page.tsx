import { Container, Paper, Stack, Typography } from '@mui/material';

import { SurveyForm } from './survey-form';

export function SurveyFormPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5">Survey form</Typography>
        </Paper>

        <SurveyForm />
      </Stack>
    </Container>
  );
}
