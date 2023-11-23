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

We need to define the functionality of our form as a constructor

Let's make these features first:

```
- create components
  - Paper
    - change padding
  - Stack
    - change direction
    - change spacing
  - Typography
    - change text
  - TextField
    - change label
  - Button
    - change text
    - change variant
```

:::note
But first we will need to create our main block which will be the parent for all the others, let's call it `root`
:::

## Block nesting scheme

Now let's visually determine our block nesting, that is, which blocks can be children of each block:

```
root: *
paper: *, !root
stack: *, !root
typography: *, !root
text-field: *, !root
button: *, !root
```
