import clsx from 'clsx';
import { HTMLAttributes, forwardRef } from 'react';

import { useFormControlContext } from './form-control';

export type FormHelperTextProps = HTMLAttributes<HTMLDivElement>;

export const FormHelperText = forwardRef<HTMLDivElement, FormHelperTextProps>(
  (props, ref) => {
    const field = useFormControlContext();

    return (
      <div
        ref={ref}
        {...field?.getHelpTextProps(props)}
        className={clsx('ui-form-helper-text text-sm', props.className)}
      />
    );
  },
);

FormHelperText.displayName = 'FormHelperText';
