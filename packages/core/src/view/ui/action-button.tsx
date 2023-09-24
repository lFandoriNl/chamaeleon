import clsx from 'clsx';
import { IconButton, IconButtonProps } from '@chameleon/uikit';

import { EditorView } from '../editor-view';

export type ActionButtonProps = IconButtonProps & {
  view: EditorView;
};

export function ActionButton({ view, ...props }: ActionButtonProps) {
  return (
    <IconButton {...props} className={clsx(props.className, 'rounded-lg')} />
  );
}
