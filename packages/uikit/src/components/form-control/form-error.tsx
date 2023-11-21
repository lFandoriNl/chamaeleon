import clsx from 'clsx';
import { HTMLAttributes, forwardRef } from 'react';

import { useFormControlContext } from './form-control';

export type FromErrorMessageProps = HTMLAttributes<HTMLDivElement>;

export const FromErrorMessage = forwardRef<
  HTMLDivElement,
  FromErrorMessageProps
>((props, ref) => {
  const field = useFormControlContext();

  return (
    <div
      ref={ref}
      {...field?.getErrorMessageProps(props)}
      className={clsx(
        'ui-form-error-message text-sm text-red-500',
        props.className,
      )}
    />
  );
});

FromErrorMessage.displayName = 'FromErrorMessage';
