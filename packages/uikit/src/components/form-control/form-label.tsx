import { HTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

import { useFormControlContext } from './form-control';

export type FormLabelProps = HTMLAttributes<HTMLLabelElement> & {
  htmlFor?: string;
};

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  (props, ref) => {
    const field = useFormControlContext();

    return (
      <label
        ref={ref}
        {...field?.getLabelProps(props)}
        className={clsx('ui-form-label text-base', props.className)}
      />
    );
  },
);

FormLabel.displayName = 'FormLabel';
