import clsx from 'clsx';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
} from 'react';

import { FromErrorMessageProps } from './form-error';
import { FormHelperTextProps } from './form-helper-text';
import { FormLabelProps } from './form-label';

export type FromControlOptions = {
  error?: boolean;
  disabled?: boolean;
};

export type FormControlContextValue = FromControlOptions & {
  id?: string;
};

export const FormControlContext = createContext<
  ReturnType<typeof useFormControlProvider> | undefined
>(undefined);

export function useFormControlContext() {
  return useContext(FormControlContext);
}

export type FormControlProps = FromControlOptions & {
  id?: string;
  className?: string;
  children: React.ReactNode[];
};

const useFormControlProvider = (props: FormControlContextValue) => {
  const { id: idProp, error, disabled } = props;

  const uuid = useId();

  const id = idProp || `field-${uuid}`;

  const labelId = `${id}-label`;
  const helpTextId = `${id}-helptext`;
  const feedbackId = `${id}-feedback`;

  const getLabelProps = useCallback<(props: FormLabelProps) => FormLabelProps>(
    (props = {}) => {
      return {
        ...props,
        id: props.id !== undefined ? props.id : labelId,
        htmlFor: props.htmlFor !== undefined ? props.htmlFor : id,
      };
    },
    [labelId],
  );

  const getHelpTextProps = useCallback<
    (props: FormHelperTextProps) => FormHelperTextProps
  >(
    (props = {}) => {
      return {
        ...props,
        id: helpTextId,
      };
    },
    [helpTextId],
  );

  const getErrorMessageProps = useCallback<
    (props: FromErrorMessageProps) => FromErrorMessageProps
  >(
    (props = {}) => {
      return {
        ...props,
        id: feedbackId,
        'aria-live': 'polite',
      };
    },
    [feedbackId],
  );

  return {
    id,
    isError: !!error,
    isDisabled: !!disabled,
    getLabelProps,
    getHelpTextProps,
    getErrorMessageProps,
  };
};

export const FormControl = forwardRef<HTMLDivElement, FormControlProps>(
  ({ id, className, error, disabled, children }, ref) => {
    const context = useFormControlProvider({
      id,
      error,
      disabled,
    });

    return (
      <FormControlContext.Provider value={context}>
        <div
          ref={ref}
          className={clsx('ui-form-control flex flex-col space-y-2', className)}
          role="group"
        >
          {children}
        </div>
      </FormControlContext.Provider>
    );
  },
);

FormControl.displayName = 'FormControl';
