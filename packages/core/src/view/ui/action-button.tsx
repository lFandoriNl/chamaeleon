import { IconButton, IconButtonProps } from '@chameleon/uikit';
import clsx from 'clsx';

export type ActionButtonProps = IconButtonProps;

export function ActionButton(props: ActionButtonProps) {
  return (
    <IconButton {...props} className={clsx(props.className, 'rounded-lg')} />
  );
}
