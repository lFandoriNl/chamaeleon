import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
};

export function SurveyForm() {
  const { control, handleSubmit } = useForm<FormState>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: 0,
    },
  });

  const onSubmit: SubmitHandler<FormState> = (data) => {
    console.log(data);
  };
  return (
    <Stack component="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
      <Paper sx={{ p: 4 }}>
        <Typography pb={2}>Provide your first and last name</Typography>

        <Stack direction="row" spacing={4}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField label="First name" variant="outlined" {...field} />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField label="Last name" variant="outlined" {...field} />
            )}
          />
        </Stack>
      </Paper>

      <Paper sx={{ p: 4 }}>
        <Typography pb={2}>Enter your email</Typography>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField label="Email name" variant="outlined" {...field} />
          )}
        />
      </Paper>

      <Paper sx={{ p: 4 }}>
        <Typography pb={2}>How old are you?</Typography>

        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <TextField label="Age" variant="outlined" {...field} />
          )}
        />
      </Paper>

      <Paper sx={{ p: 4 }}>
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained">
            Submit
          </Button>

          <Button variant="outlined">Clear</Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
