---
title: TextField block
description: Creating a text-field block
sidebar:
  order: 5
---

Now let's create a `TextField` block `builder/plugins/text-field.tsx`

```tsx
// builder/plugins/text-field.tsx
import { Plugin } from '@chamaeleon/core';
import MuiTextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller, useFormContext } from 'react-hook-form';

export function TextField(): Plugin {
  return {
    name: 'text-field',
    apply(editor, { addBlock }) {
      addBlock({
        name: 'text-field',
        props: {
          label: {
            default: 'Label',
          },
          fieldName: {
            default: '',
          },
        },
        components: {
          view: ({ block }) => {
            const { control } = useFormContext();

            return (
              <Controller
                name={block.props.fieldName}
                control={control}
                render={({ field }) => (
                  <MuiTextField
                    label={block.props.label}
                    variant="outlined"
                    {...field}
                    value={field.value || ''}
                  />
                )}
              />
            );
          },
          editor: ({ block }) => {
            const { control } = useFormContext();

            return (
              <Controller
                name={block.props.fieldName}
                control={control}
                shouldUnregister
                render={({ field }) => (
                  <MuiTextField
                    inputRef={ref}
                    label={block.props.label}
                    variant="outlined"
                    {...field}
                    value={field.value || ''}
                  />
                )}
              />
            );
          },
          palette: () => {
            return <Typography>TextField</Typography>;
          },
        },
      });
    },
  };
}
```

Adding to editor

```diff lang="ts"
// demo.tsx
+import { TextField } from './builder/plugins/text-field';

const editor = new Editor({
  plugins: [
    // ...
    Root(),
    Paper(),
    Stack(),
    Text(),
+    TextField(),
  ],
});
```

For `useFormContext` to work, we need to wrap our form in a `FormProvider`

```tsx
// pages/survey-form/survey-form.tsx
export function SurveyForm() {
  const methods = useForm<FormState>();

  return <FormProvider {...methods}>...</FormProvider>;
}
```
