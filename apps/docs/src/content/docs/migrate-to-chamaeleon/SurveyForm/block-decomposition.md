---
title: Block decomposition
description: Block decomposition for future implementation of block plugins
sidebar:
  order: 2
---

Let's look at our form in more detail

```tsx
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
```

As a result of the tutorial, the following features of our builder will be implemented (each block will have drag and drop)

```
- persisted state
- undo redo state
- create blocks
  - Paper
    - change padding
  - Stack
    - change direction
    - change spacing
  - Typography
    - change padding
    - change text
  - TextField
    - change label
    - change field name
  - Button
    - change text
    - change type
    - change variant
```

:::note
But first we will need to create our main block which will be the parent for all the others, let's call it `root`
:::
