import { FromControlOptions, useFormControlContext } from './form-control';

type UseFormControlProps = FromControlOptions & {
  id?: string;
  error?: boolean;
  disabled?: boolean;
};

export function useFormControl(props: UseFormControlProps) {
  const { id, error, disabled } = props;

  const field = useFormControlContext();

  return {
    id: id ?? field?.id,
    isError: error ?? field?.isError,
    isDisabled: disabled ?? field?.isDisabled,
  };
}
